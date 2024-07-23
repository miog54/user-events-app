const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.admin = await Admin.findById(decoded.adminId).select('-password');
    if (!req.admin) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};
