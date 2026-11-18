const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create new order from user's cart (Pre-Payment Gateway Phase)
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'GATEWAY_PENDING' } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      res.status(400);
      throw new Error('Complete shipping address is required');
    }

    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart || user.cart.length === 0) {
      res.status(400);
      throw new Error('Your cart is empty');
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of user.cart) {
      if (!item.product) continue;
      if (item.product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }

      subtotal += item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity
      });

      // Decrement product stock
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    const shippingFee = subtotal >= 100 ? 0 : 9.99;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shippingAddress,
      subtotal: Number(subtotal.toFixed(2)),
      shippingFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'Processing'
    });

    // Clear user cart after order placement
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Payment Gateway Hook Stub (Ready for Final Phase Integration)
// @route   PATCH /api/orders/:id/pay
exports.markOrderPaidStub = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'Confirmed';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status hook triggered (Phase 2 Gateway Placeholder)',
      order
    });
  } catch (error) {
    next(error);
  }
};
