const User = require('../models/User');
const Product = require('../models/Product');

const populateAndFormatCart = async (userId) => {
  const user = await User.findById(userId).populate('cart.product');
  // Filter out any null products in case a product was removed from DB
  const validItems = user.cart.filter((item) => item.product !== null);
  if (validItems.length !== user.cart.length) {
    user.cart = validItems;
    await user.save();
  }
  return validItems;
};

// @desc    Get user's cart
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const items = await populateAndFormatCart(req.user._id);
    res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or increment quantity
// @route   POST /api/cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newQty = user.cart[existingIndex].quantity + Number(quantity);
      user.cart[existingIndex].quantity = Math.min(newQty, product.stock);
    } else {
      user.cart.push({
        product: productId,
        quantity: Math.min(Number(quantity), product.stock)
      });
    }

    await user.save();
    const items = await populateAndFormatCart(req.user._id);

    res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex === -1) {
      res.status(404);
      throw new Error('Item not found in cart');
    }

    if (Number(quantity) <= 0) {
      user.cart.splice(existingIndex, 1);
    } else {
      user.cart[existingIndex].quantity = Number(quantity);
    }

    await user.save();
    const items = await populateAndFormatCart(req.user._id);

    res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:productId
exports.removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    const items = await populateAndFormatCart(req.user._id);

    res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      items: []
    });
  } catch (error) {
    next(error);
  }
};
