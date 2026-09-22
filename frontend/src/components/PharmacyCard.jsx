import React from 'react';
import { Link } from 'react-router-dom';

const PharmacyCard = ({ pharmacy }) => {
  return (
    <div className="card">
      <h3>{pharmacy.name}</h3>
      <p><strong>Location:</strong> {pharmacy.location}</p>
      <p><strong>Address:</strong> {pharmacy.address}</p>
      <p><strong>Phone:</strong> {pharmacy.phone}</p>
      <p><strong>Hours:</strong> {pharmacy.openingTime} - {pharmacy.closingTime}</p>
      <Link to={`/pharmacy/${pharmacy._id}`}>
        <button className="btn" style={{ width: '100%', marginTop: '10px' }}>View Details & Medicines</button>
      </Link>
    </div>
  );
};

export default PharmacyCard;