import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, removeToCart } from "../redux/cartSlice";
import "../styles/product.css";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const updateQuantity = (item, quantity) => {
    if (quantity <= 0) {
      dispatch(removeToCart(item._id));
      return;
    }

    dispatch(addToCart({ ...item, quantity }));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="product-detail-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="product-detail-card">
          <p>Your cart is empty.</p>
          <Link to="/" className="view-details-button">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div className="cart-item-card" key={item._id}>
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>₹{item.price?.toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}>+</button>
                  </div>
                </div>

                <button className="remove-btn" onClick={() => dispatch(removeToCart(item._id))}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>₹{deliveryFee.toFixed(2)}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>
            <Link to="/checkout" className="view-details-button">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
