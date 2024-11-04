const express = require('express');
const { getExchangeRate } = require('../controllers/currencyController');
const rateLimiter = require('../middlewares/ratelimiter');

const router = express.Router();

router.get('/exchange-rate', rateLimiter, getExchangeRate);

/**
 * @swagger
 * /api/exchange-rate:
 *   get:
 *     summary: Retrieve exchange rate between two currencies
 *     parameters:
 *       - name: from
 *         in: query
 *         required: true
 *         description: Base currency code (e.g., USD)
 *         schema:
 *           type: string
 *       - name: to
 *         in: query
 *         required: true
 *         description: Target currency code (e.g., EUR)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 rate:
 *                   type: number
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

module.exports = router;
