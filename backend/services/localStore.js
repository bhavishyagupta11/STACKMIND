const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'local-db.json');
const EMPTY_STATE = { users: [], reviews: [] };

const ensureDbFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_STATE, null, 2));
  }
};

const readState = () => {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    };
  } catch {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_STATE, null, 2));
    return { ...EMPTY_STATE };
  }
};

const writeState = (state) => {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const toPublicUser = (user) => {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
};

const createUser = async ({ name, email, password }) => {
  const state = readState();
  const normalizedEmail = normalizeEmail(email);

  if (state.users.some((user) => user.email === normalizedEmail)) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const now = new Date().toISOString();
  const user = {
    _id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    createdAt: now,
    updatedAt: now,
  };

  state.users.push(user);
  writeState(state);
  return toPublicUser(user);
};

const findUserByEmail = (email = '') => {
  const state = readState();
  const normalizedEmail = normalizeEmail(email);
  return state.users.find((user) => user.email === normalizedEmail) || null;
};

const findUserById = (id = '') => {
  const state = readState();
  return state.users.find((user) => user._id === id) || null;
};

const comparePassword = async (user, password) => {
  if (!user) return false;
  return bcrypt.compare(password, user.password);
};

const updateUser = async (userId, { name, email, currentPassword, newPassword }) => {
  const state = readState();
  const index = state.users.findIndex((user) => user._id === userId);

  if (index === -1) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const emailOwner = state.users.find((user) => user.email === normalizedEmail);

  if (emailOwner && emailOwner._id !== userId) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  if (newPassword) {
    const isMatch = await comparePassword(state.users[index], currentPassword);
    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }
  }

  const updated = {
    ...state.users[index],
    name: name.trim(),
    email: normalizedEmail,
    updatedAt: new Date().toISOString(),
  };

  if (newPassword) {
    updated.password = await bcrypt.hash(newPassword, 12);
  }

  state.users[index] = updated;
  writeState(state);
  return toPublicUser(updated);
};

const deriveTitleFromCode = (code = '') => {
  const line = code
    .split('\n')
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith('//') && !item.startsWith('/*') && !item.startsWith('*'));

  return line ? line.slice(0, 80) : 'Untitled Review';
};

const createReview = async (reviewInput) => {
  const state = readState();
  const now = new Date().toISOString();
  const review = {
    _id: crypto.randomUUID(),
    ...reviewInput,
    title: deriveTitleFromCode(reviewInput.code),
    createdAt: now,
    updatedAt: now,
  };

  state.reviews.push(review);
  writeState(state);
  return review;
};

const listReviewsByUser = (userId) => {
  const state = readState();
  return state.reviews
    .filter((review) => review.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const countReviewsByUser = (userId) => listReviewsByUser(userId).length;

const getReviewById = (userId, reviewId) => {
  const state = readState();
  return state.reviews.find((review) => review._id === reviewId && review.userId === userId) || null;
};

const deleteReviewById = (userId, reviewId) => {
  const state = readState();
  const index = state.reviews.findIndex((review) => review._id === reviewId && review.userId === userId);
  if (index === -1) return null;
  const [removed] = state.reviews.splice(index, 1);
  writeState(state);
  return removed;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  comparePassword,
  updateUser,
  createReview,
  listReviewsByUser,
  countReviewsByUser,
  getReviewById,
  deleteReviewById,
};
