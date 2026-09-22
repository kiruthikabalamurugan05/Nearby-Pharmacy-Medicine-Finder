const express = require('express');

const router = express.Router();

const {
  getAdminStats,
  getAllCustomers,
  getAllPharmaciesAdmin,
  getPendingPharmacies,
  verifyPharmacy,
  deleteUser
} = require('../controllers/adminController');

const {
  protect,
  adminOnly
} = require('../middleware/auth');


// ================= ADMIN STATS =================

router.get(
  '/stats',
  protect,
  adminOnly,
  getAdminStats
);


// ================= ALL CUSTOMERS =================

router.get(
  '/customers',
  protect,
  adminOnly,
  getAllCustomers
);


// ================= ALL PHARMACIES =================

router.get(
  '/pharmacies',
  protect,
  adminOnly,
  getAllPharmaciesAdmin
);


// ================= PENDING PHARMACIES =================

router.get(
  '/pharmacies/pending',
  protect,
  adminOnly,
  getPendingPharmacies
);


// ================= APPROVE / REJECT PHARMACY =================

router.put(
  '/pharmacies/:id/verify',
  protect,
  adminOnly,
  verifyPharmacy
);


// ================= DELETE USER =================

router.delete(
  '/users/:id',
  protect,
  adminOnly,
  deleteUser
);


module.exports = router;