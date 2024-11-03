const express = require('express');
const { getExchangeRate } = require('../controllers/currencyController');
const rateLimiter = require('../middlewares/ratelimiter');

const router = express.Router();

router.get('/exchange-rate', rateLimiter, getExchangeRate);

module.exports = router;
