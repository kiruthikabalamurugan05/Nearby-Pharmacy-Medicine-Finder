const express = require('express');
const router = express.Router();
const { protect, adminOnly: admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  registerPharmacy,
  getApprovedPharmacies,
  getPendingPharmacies,
  verifyPharmacy
} = require('../controllers/pharmacyController');

// Public route for app users
router.get('/', getApprovedPharmacies);

// Pharmacy owners register their pharmacy
router.post(
  '/register',
  upload.single('licence'),
  registerPharmacy
);

// Admin-only routes (Requires Admin Role)
router.get('/admin/pending', protect, admin, getPendingPharmacies);
router.put('/admin/verify/:pharmacyId', protect, admin, verifyPharmacy);

module.exports = router;