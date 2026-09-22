const express = require('express');
const router = express.Router();
const { getAllMedicines, searchMedicines, getMedicinesByPharmacy, addMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const { protect, pharmacyOnly } = require('../middleware/auth');

router.get('/search', searchMedicines);
router.get('/pharmacy/:pharmacyId', getMedicinesByPharmacy);
router.get('/', getAllMedicines);
router.post('/', protect, pharmacyOnly, addMedicine);
router.put('/:id', protect, pharmacyOnly, updateMedicine);
router.delete('/:id', protect, pharmacyOnly, deleteMedicine);

module.exports = router;