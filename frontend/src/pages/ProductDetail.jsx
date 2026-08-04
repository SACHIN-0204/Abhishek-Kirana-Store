import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../styles/product.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const existingItem = cartItems.find((item) => item._id === product._id);

      if (existingItem) {
        alert("Item is already available in cart");
        return;
      }

      dispatch(addToCart({ ...product, quantity: 1 }));
      alert("Item selected and added to cart");
    }
  };

  if (loading) {
    return <div className="product-detail-page"><p>Loading product...</p></div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <p className="product-error">{error || "Product not found"}</p>
        <Link to="/" className="view-details-button">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">← Back to products</Link>

      <div className="product-detail-card">
        <img src={product.imageUrl} alt={product.name} className="product-detail-image" />

        <div className="product-detail-info">
          <p className="product-category">{product.category || "Grocery"}</p>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description || "Fresh and quality product from Abhishek Kirana Store."}</p>

          <div className="product-price-row">
            <span className="product-detail-price">₹{product.price?.toFixed(2)}</span>
            <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <button className="view-details-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
