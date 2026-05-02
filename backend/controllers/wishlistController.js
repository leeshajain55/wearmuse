const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const populated = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: populated.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
