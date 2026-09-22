import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MedicineCard from '../components/MedicineCard';

const PharmacyDetails = () => {
  const { id } = useParams();
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await axios.get(`${import.meta.env.VITE_API_URL}/pharmacies/${id}`);
        setPharmacy(pRes.data);

        const mRes = await axios.get(`${import.meta.env.VITE_API_URL}/medicines/pharmacy/${id}`);
        setMedicines(mRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!pharmacy) return <div className="container"><p>Loading pharmacy details...</p></div>;

  return (
    <div className="container">
      <h2>{pharmacy.name}</h2>
      <div className="card" style={{ marginBottom: '20px' }}>
        <p><strong>Owner:</strong> {pharmacy.ownerName}</p>
        <p><strong>Address:</strong> {pharmacy.address}, {pharmacy.location}</p>
        <p><strong>Phone:</strong> {pharmacy.phone}</p>
        <p><strong>Hours:</strong> {pharmacy.openingTime} - {pharmacy.closingTime}</p>
      </div>

      <h3>Available Medicines</h3>
      <div className="card-grid">
        {medicines.length > 0 ? (
          medicines.map(m => <MedicineCard key={m._id} medicine={m} />)
        ) : (
          <p>No medicines listed by this pharmacy yet.</p>
        )}
      </div>
    </div>
  );
};

export default PharmacyDetails;