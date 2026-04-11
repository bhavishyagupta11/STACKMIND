const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  createUser,
  findUserByEmail,
  findUserById,
  comparePassword,
  updateUser,
} = require('../services/localStore');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

// Generate a signed JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    let user;
    if (req.app.locals.persistenceMode === 'local') {
      user = await createUser({ name, email: normalizedEmail, password });
    } else {
      // Check if user already exists
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user;
    if (req.app.locals.persistenceMode === 'local') {
      user = findUserByEmail(normalizedEmail);
      if (!user || !(await comparePassword(user, password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // Find user and explicitly include password field
      user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  if (req.app.locals.persistenceMode === 'local') {
    const user = findUserById(req.user._id);
    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  }

  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};

// @desc    Update current logged-in user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const trimmedName = name?.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName || !normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ success: false, message: 'Name must be between 2 and 50 characters' });
    }

    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    if (newPassword && !currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required to set a new password' });
    }

    if (req.app.locals.persistenceMode === 'local') {
      const user = await updateUser(req.user._id, {
        name: trimmedName,
        email: normalizedEmail,
        currentPassword,
        newPassword,
      });

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: { id: user._id, name: user.name, email: user.email },
      });
    }

    const emailOwner = await User.findOne({ email: normalizedEmail });
    if (emailOwner && emailOwner._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    user.name = trimmedName;
    user.email = normalizedEmail;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe, updateProfile };
