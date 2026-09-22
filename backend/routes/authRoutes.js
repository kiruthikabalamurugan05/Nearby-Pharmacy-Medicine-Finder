const express = require('express');

const router = express.Router();

const {
  register,
  registerPharmacy,
  login,
  getProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const upload = require('../middleware/upload');

// ================= CUSTOMER REGISTRATION =================

router.post(
  '/register',
  register
);

// ================= PHARMACY REGISTRATION =================

router.post(
  '/pharmacy/register',
  upload.single('licence'),
  registerPharmacy
);

// ================= LOGIN =================

router.post(
  '/login',
  login
);

// ================= PROFILE =================

router.get(
  '/profile',
  protect,
  getProfile
);

module.exports = router;