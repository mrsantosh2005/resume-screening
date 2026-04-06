const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

// ✅ AUTH ROUTES - YE SABSE IMPORTANT HAI
const authRoutes = require('./routes/auth');
console.log('Auth routes loaded:', authRoutes); // Debug log
app.use('/api/auth', authRoutes);

// ✅ OTHER ROUTES
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resumes', require('./routes/resumes'));

// 404 handler
app.use('*', (req, res) => {
  console.log('Route not found:', req.originalUrl);
  res.status(404).json({ 
    success: false, 
    error: `Route ${req.originalUrl} not found` 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});