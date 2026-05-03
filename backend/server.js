require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path'); // ✅ ADD THIS

const authRoutes = require('./src/routes/auth');
const apiRoutes = require('./src/routes/apis');
const keyRoutes = require('./src/routes/keys');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/apis', apiRoutes);
app.use('/api/keys', keyRoutes);

// ✅ Serve React build
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ SPA fallback — replaces your old 404 handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(errorHandler);

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT:', err);
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL || 'mongodb://localhost:27017/meterflow')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;