import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Nearby Pharmacy Finder</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
        Find medicines and registered pharmacies in your location instantly.
      </p>
      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/login"><button className="btn" style={{ padding: '12px 24px' }}>Login</button></Link>
        <Link to="/register"><button className="btn" style={{ background: '#475569', padding: '12px 24px' }}>Register</button></Link>
      </div>
    </div>
  );
};

export default Home;