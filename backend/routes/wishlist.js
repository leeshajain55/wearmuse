const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWishlist).post(protect, toggleWishlist);

module.exports = router;
