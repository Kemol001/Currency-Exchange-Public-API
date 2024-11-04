const currencyService = require('../services/currencyService');

const getExchangeRate = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            const error = new Error('From and To currencies are required');
            error.status = 400;
            throw error;
        }

        const rate = await currencyService.getExchangeRate(from, to);
        res.json({ from, to, rate });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

module.exports = { getExchangeRate };
