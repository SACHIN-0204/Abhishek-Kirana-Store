import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-detail-page">
      <h1>Shop</h1>
      <p>Explore the latest essentials from Abhishek Kirana Store.</p>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="product-error">{error}</p>
      ) : (
        <div className="products-list">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
