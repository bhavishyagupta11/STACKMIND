const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { findUserById } = require('../services/localStore');

const protect = async (req, res, next) => {
  let token;

  // Support Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (req.app.locals.persistenceMode === 'local') {
      req.user = findUserById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
    } else {
      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

module.exports = { protect };
