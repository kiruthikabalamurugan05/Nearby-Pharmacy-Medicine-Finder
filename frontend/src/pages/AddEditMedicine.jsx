import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AddEditMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Tablet', price: '', quantity: '', expiryDate: '', available: true
  });

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/medicines`).then(res => {
        const item = res.data.find(m => m._id === id);
        if (item) setFormData(item);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/medicines/${id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/medicines`, formData);
      }
      navigate('/pharmacy-dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <h2>{id ? 'Edit Medicine' : 'Add New Medicine'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicine Name</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Price (₹)</label>
          <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input type="number" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Expiry Date</label>
          <input type="date" required value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Availability</label>
          <select value={formData.available} onChange={(e) => setFormData({...formData, available: e.target.value === 'true'})}>
            <option value="true">Available</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Save Medicine</button>
      </form>
    </div>
  );
};

export default AddEditMedicine;