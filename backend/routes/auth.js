const express = require('express');
const router = express.Router();
const { register, login, getMe, updateAddresses, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/addresses', protect, updateAddresses);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
