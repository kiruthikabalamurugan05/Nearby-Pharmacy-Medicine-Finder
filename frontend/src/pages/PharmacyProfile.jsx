import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PharmacyProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', ownerName: '', phone: '', address: '', location: '', openingTime: '', closingTime: ''
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/pharmacies/my-profile`).then(res => {
      setFormData(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/pharmacies/my-profile`, formData);
      alert('Profile updated!');
      navigate('/pharmacy-dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <h2>Update Pharmacy Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pharmacy Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Location / City</label>
          <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Full Address</label>
          <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Opening Time</label>
          <input type="text" value={formData.openingTime} onChange={(e) => setFormData({...formData, openingTime: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Closing Time</label>
          <input type="text" value={formData.closingTime} onChange={(e) => setFormData({...formData, closingTime: e.target.value})} />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Update Profile</button>
      </form>
    </div>
  );
};

export default PharmacyProfile;