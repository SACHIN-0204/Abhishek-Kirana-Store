import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        alert('Product created successfully with Cloudinary Image URL!');
        navigate('/shop');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Add New Product</h2>
          <p style={subtitleStyle}>Add a new product with image, price, category and inventory details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldRowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Category</label>
            <input
              type="text"
              placeholder="Enter product category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={fieldRowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price</label>
            <input
              type="number"
              placeholder="₹0.00"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Stock Quantity</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            placeholder="Write a short product description"
            required
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
          />
        </div>

        <div style={uploadBoxStyle}>
          <label style={uploadLabelStyle}>Upload Product Image</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
            style={uploadInputStyle}
          />
        </div>

        <button type="submit" disabled={loading} className="btn" style={submitStyle}>
          {loading ? 'Uploading & Creating...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: '720px',
  margin: '40px auto',
  padding: '32px',
  background: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)',
};

const headerStyle = {
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyle = {
  margin: 0,
  color: '#111827',
  fontSize: '1.95rem',
};

const subtitleStyle = {
  margin: '8px 0 0',
  color: '#6b7280',
  lineHeight: 1.6,
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const fieldRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const labelStyle = {
  color: '#4b5563',
  fontSize: '0.95rem',
};

const inputStyle = {
  padding: '14px 16px',
  background: '#f8fafc',
  border: '1px solid #d1d5db',
  borderRadius: '12px',
  color: '#111827',
  fontSize: '1rem',
  outline: 'none',
};

const uploadBoxStyle = {
  padding: '18px',
  border: '1px dashed #d1d5db',
  borderRadius: '14px',
  background: '#f9fafb',
};

const uploadLabelStyle = {
  display: 'block',
  marginBottom: '14px',
  color: '#4b5563',
  fontSize: '0.95rem',
};

const uploadInputStyle = {
  color: '#111827',
};

const submitStyle = {
  marginTop: '8px',
  padding: '14px 18px',
  borderRadius: '12px',
  background: '#111827',
  border: 'none',
  color: '#ffffff',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'transform 150ms ease, opacity 150ms ease',
};

export default AddProduct;