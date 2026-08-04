import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setFormData({ name: data.name, description: data.description, price: data.price, category: data.category, stock: data.stock });
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
      body: data
    });
    setLoading(false);
    if (res.ok) {
      alert('Product updated successfully!');
      navigate('/admin/products');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Edit Product</h2>
      <p style={subtitleStyle}>Update product details, pricing, stock, and image information.</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          required
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ ...inputStyle, minHeight: '130px', resize: 'vertical' }}
        />
        <div style={gridStyle}>
          <input
            type="number"
            placeholder="Price"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Stock"
            required
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={uploadBoxStyle}>
          <label style={uploadLabelStyle}>Replace Image (Optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={uploadInputStyle} />
        </div>
        <button type="submit" disabled={loading} className="btn" style={submitStyle}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: '680px',
  margin: '40px auto',
  padding: '36px',
  background: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)',
};

const titleStyle = {
  margin: 0,
  color: '#111827',
  fontSize: '1.85rem',
};

const subtitleStyle = {
  margin: '10px 0 24px',
  color: '#6b7280',
  lineHeight: 1.6,
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '16px',
};

const inputStyle = {
  width: '100%',
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
  marginBottom: '12px',
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

export default EditProduct;
