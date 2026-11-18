const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { name, phone, avatar, address } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (address) {
      user.address = {
        street: address.street ?? user.address.street,
        city: address.city ?? user.address.city,
        state: address.state ?? user.address.state,
        zipCode: address.zipCode ?? user.address.zipCode,
        country: address.country ?? user.address.country
      };
    }

    const updated = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatar,
        address: updated.address,
        wishlist: updated.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/users/password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      res.status(400);
      throw new Error('Please provide current password and a new password (min 6 chars)');
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist product
// @route   POST /api/users/wishlist/:productId
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    await user.populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete user account and associated data
// @route   DELETE /api/users/account
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Order.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
};
