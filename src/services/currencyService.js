const axios = require('axios');
const cache = require('../utils/cache');
const config = require('../config/config');

const getExchangeRate = async (from, to) => {
    const cacheKey = `${from}_${to}`;
    const cachedRate = await cache.get(cacheKey);

    // Return cached rate if available
    if (cachedRate) {
        return `From Cache: ${cachedRate}`;
    }

    try {
        const response = await axios.get(`${config.EXCHANGE_API_URL}/${from}`, {
            headers: {
                'Authorization': `Bearer ${config.API_KEY}`
            }
        });

        const rate = response.data.rates[to];
        if (!rate) {
            const error = new Error('Invalid currency code');
            error.status = 400;
            throw error;
        }

        // Store the rate in cache
        await cache.set(cacheKey, rate);
        return rate;
    } catch (error) {
        const customError = new Error(`Error fetching exchange rate: ${error.message}`);
        customError.status = error.response ? error.response.status : 500;
        throw customError;
    }
};

module.exports = { getExchangeRate };