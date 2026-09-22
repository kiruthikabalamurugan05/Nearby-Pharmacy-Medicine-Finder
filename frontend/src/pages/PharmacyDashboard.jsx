import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PharmacyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchPharmacyData();
  }, []);

  const fetchPharmacyData = async () => {
    try {
      const pRes = await axios.get(`${import.meta.env.VITE_API_URL}/pharmacies/my-profile`);
      setPharmacy(pRes.data);

      const mRes = await axios.get(`${import.meta.env.VITE_API_URL}/medicines/pharmacy/${pRes.data._id}`);
      setMedicines(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/medicines/${id}`);
        fetchPharmacyData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container">
      <h2>Pharmacy Dashboard</h2>
      <p>Welcome, <strong>{user?.name}</strong></p>

      {pharmacy && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <h3>Total Medicines</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{medicines.length}</p>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <h3>In-Stock Medicines</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{medicines.filter(m => m.available).length}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Inventory List</h3>
        <Link to="/pharmacy/add-medicine"><button className="btn">+ Add New Medicine</button></Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Price</th>
            <th style={{ padding: '10px' }}>Qty</th>
            <th style={{ padding: '10px' }}>Expiry</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(m => (
            <tr key={m._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px' }}>{m.name}</td>
              <td style={{ padding: '10px' }}>{m.category}</td>
              <td style={{ padding: '10px' }}>₹{m.price}</td>
              <td style={{ padding: '10px' }}>{m.quantity}</td>
              <td style={{ padding: '10px' }}>{m.expiryDate}</td>
              <td style={{ padding: '10px' }}>{m.available ? 'Available' : 'Out of Stock'}</td>
              <td style={{ padding: '10px' }}>
                <Link to={`/pharmacy/edit-medicine/${m._id}`}>
                  <button className="btn" style={{ marginRight: '5px' }}>Edit</button>
                </Link>
                <button onClick={() => handleDelete(m._id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PharmacyDashboard;