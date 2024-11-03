const currencyService = require('../services/currencyService');

const getExchangeRate = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            return res.status(400).json({ error: 'From and To currencies are required' });
        }

        const rate = await currencyService.getExchangeRate(from, to);
        res.json({ from, to, rate });
    } catch (error) {
        next(error);
    }
};

module.exports = { getExchangeRate };
