import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/register.css";



const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login({
        name: data.username,
        email: data.email,
        role: data.role || "customer",
        token: data.token,
      });

      setMessage({ type: "success", text: data.message || "Account created successfully!" });
      navigate("/");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <h1>Create your account</h1>
          <p>Join Abhishek Kirana Store to shop fresh essentials and track your orders with ease.</p>
        </div>

        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <p>Fill in your details to get started.</p>

            <div className="form-group">
              <label htmlFor="username">Full name</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {message.text && (
              <div className={`auth-message ${message.type}`}>{message.text}</div>
            )}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="auth-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
