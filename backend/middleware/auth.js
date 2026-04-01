const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized - No token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }
    
    console.log('Authenticated user:', req.user.email, 'Role:', req.user.role); // Debug
    next();
  } catch (err) {
    console.error('Token error:', err.message);
    return res.status(403).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied. User role: ${req.user.role}, Required: ${roles}`);
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized. Required role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};