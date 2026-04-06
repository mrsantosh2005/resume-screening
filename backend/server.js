const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://resume-screening-frontend.onrender.com', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// ✅ TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

// ✅ AUTH ROUTES - YE SABSE IMPORTANT HAI
app.use('/api/auth', require('./routes/auth'));

// ✅ OTHER ROUTES
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resumes', require('./routes/resumes'));

// 404 handler
app.use('*', (req, res) => {
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