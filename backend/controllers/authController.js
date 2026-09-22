const User = require('../Models/User');
const Pharmacy = require('../Models/Pharmacy');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= GENERATE TOKEN =================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
};

// ================= CUSTOMER REGISTRATION =================

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      location
    } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'Please fill in all required fields'
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'customer',
      status: 'approved',
      location: location || ''
    });

    res.status(201).json({
      message: 'Customer account created successfully',
      userId: user._id
    });

  } catch (error) {
    console.error('Customer registration error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

// ================= PHARMACY REGISTRATION =================

exports.registerPharmacy = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      city
    } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password || !city) {
      return res.status(400).json({
        message: 'Please fill in all required fields'
      });
    }

    // Licence required
    if (!req.file) {
      return res.status(400).json({
        message: 'Pharmacy licence is required'
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create pharmacy owner as PENDING
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'pharmacy',
      status: 'pending',
      location: city
    });

    // Create pharmacy
    const pharmacy = await Pharmacy.create({
  name,
  email,
  licenseNumber: `PENDING-${Date.now()}`,
  licenseDocument: req.file.filename,
  address: city,
  phone,
  owner: user._id,
  status: 'pending'
});
    res.status(201).json({
      message:
        'Pharmacy registration request sent to Admin. Please wait for approval.',
      pharmacyId: pharmacy._id
    });

  } catch (error) {
    console.error('Pharmacy registration error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

// ================= LOGIN =================

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // ================= PHARMACY STATUS =================

    if (user.role === 'pharmacy') {

      if (user.status === 'pending') {
        return res.status(403).json({
          message:
            'Your pharmacy registration is pending Admin approval.'
        });
      }

      if (user.status === 'rejected') {
        return res.status(403).json({
          message:
            'Your pharmacy registration has been rejected by Admin.'
        });
      }
    }

    // ================= GENERATE TOKEN =================

    const token = generateToken(user);

    res.status(200).json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

// ================= PROFILE =================

exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};