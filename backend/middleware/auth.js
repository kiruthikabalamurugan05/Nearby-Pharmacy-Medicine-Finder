const jwt = require('jsonwebtoken');

// Verify standard JWT token
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Contains id and role
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Role Checking Middlewares
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

const pharmacyOnly = (req, res, next) => {
  if (req.user && req.user.role === 'pharmacy') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Pharmacy only' });
  }
};

const customerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Customer only' });
  }
};

module.exports = { protect, adminOnly, pharmacyOnly, customerOnly };