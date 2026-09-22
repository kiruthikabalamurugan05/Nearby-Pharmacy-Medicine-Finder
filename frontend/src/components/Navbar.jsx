import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>💊 Nearby Pharmacy Finder</Link>
      <div>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {user.role === 'customer' && <Link to="/customer-dashboard">Dashboard</Link>}
            {user.role === 'pharmacy' && (
              <>
                <Link to="/pharmacy-dashboard">Dashboard</Link>
                <Link to="/pharmacy-profile">Profile</Link>
              </>
            )}
            {user.role === 'admin' && <Link to="/admin-dashboard">Admin Dashboard</Link>}
            <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '15px' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;