const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

console.log('Auth routes initializing...'); // Debug log

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

console.log('Auth routes: POST /register, POST /login, GET /me'); // Debug log

module.exports = router;