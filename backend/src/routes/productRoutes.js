const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog browsing and search
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve list of products with optional category and search filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (Electronics, Fashion, Home, Fitness, Accessories)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Array of products
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get detailed information for a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

module.exports = router;
