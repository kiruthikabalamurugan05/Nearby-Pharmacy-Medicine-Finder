import React from 'react';

const MedicineCard = ({ medicine, showPharmacy = false }) => {
  return (
    <div className="card">
      <h3>{medicine.name}</h3>
      <p><span className="badge badge-success">{medicine.category}</span></p>
      <p>{medicine.description}</p>
      <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Price: ₹{medicine.price}</p>
      <p>Quantity: {medicine.quantity}</p>
      <p>Status: {medicine.available ? 
        <span className="badge badge-success">Available</span> : 
        <span className="badge badge-danger">Out of Stock</span>}
      </p>

      {showPharmacy && medicine.pharmacyId && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc' }}>
          <h4>Pharmacy Info:</h4>
          <p><strong>Name:</strong> {medicine.pharmacyId.name}</p>
          <p><strong>Address:</strong> {medicine.pharmacyId.address} ({medicine.pharmacyId.location})</p>
          <p><strong>Phone:</strong> {medicine.pharmacyId.phone}</p>
        </div>
      )}
    </div>
  );
};

export default MedicineCard;