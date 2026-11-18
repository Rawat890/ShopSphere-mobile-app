const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  markOrderPaidStub
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order placement and order history (Payment Gateway ready)
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *   post:
 *     summary: Place a new order from current cart items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddress]
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, GATEWAY_PENDING]
 *     responses:
 *       201:
 *         description: Order created
 */
router.route('/').get(protect, getMyOrders).post(protect, createOrder);

/**
 * @swagger
 * /orders/{id}/pay:
 *   patch:
 *     summary: Payment gateway confirmation webhook stub (Final Phase integration point)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as paid
 */
router.patch('/:id/pay', protect, markOrderPaidStub);

module.exports = router;
