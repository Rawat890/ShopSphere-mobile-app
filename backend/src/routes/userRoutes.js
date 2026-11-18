const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  toggleWishlist,
  getWishlist,
  deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Profile maintenance, wishlist, and account deletion
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile and shipping address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *               address:
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
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put('/password', protect, changePassword);

/**
 * @swagger
 * /users/wishlist:
 *   get:
 *     summary: Get user's saved wishlist products
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlisted products
 */
router.get('/wishlist', protect, getWishlist);

/**
 * @swagger
 * /users/wishlist/{productId}:
 *   post:
 *     summary: Add or remove a product from wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated wishlist
 */
router.post('/wishlist/:productId', protect, toggleWishlist);

/**
 * @swagger
 * /users/account:
 *   delete:
 *     summary: Permanently delete user account and all associated orders/cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account permanently deleted
 */
router.delete('/account', protect, deleteAccount);

module.exports = router;
