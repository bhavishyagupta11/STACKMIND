require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');
const historyRoutes = require('./routes/history');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.set('trust proxy', 1);
app.locals.persistenceMode = 'mongo';

const parseAllowedOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = parseAllowedOrigins(process.env.CLIENT_URL || 'http://localhost:5173');

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Global rate limiter — 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Stricter limiter for AI review endpoint
const reviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Review limit reached. Please wait a minute.' },
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/review', reviewLimiter, reviewRoutes);
app.use('/api/history', historyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'STACKMIND API is running 🚀', timestamp: new Date() });
});

// Serve a built frontend when the React app is deployed from the same service.
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(frontendIndexPath);
  });
}

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database + Server Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const useLocalStore = String(process.env.USE_LOCAL_STORE || '').toLowerCase() === 'true';

const startServer = (mode) => {
  if (app.locals.serverStarted) return;
  app.locals.persistenceMode = mode;
  app.locals.serverStarted = true;

  app.listen(PORT, () => {
    if (mode === 'mongo') {
      console.log('✅ MongoDB connected');
    } else {
      console.warn('⚠️ MongoDB unavailable, running in local file-backed mode');
    }
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

if (useLocalStore) {
  console.warn('⚠️ USE_LOCAL_STORE=true. Starting in local file-backed mode.');
  startServer('local');
} else if (!MONGODB_URI) {
  console.warn('⚠️ Missing MONGODB_URI. Starting in local file-backed mode.');
  startServer('local');
} else {
  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => startServer('mongo'))
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      console.error('   Fix the Atlas connection string, whitelist your IP, or set USE_LOCAL_STORE=true for local-only development.');
      process.exit(1);
    });
}

module.exports = app;
