const axios = require('axios');
const cache = require('../utils/cache');
const config = require('../config/config');

const getExchangeRate = async (from, to) => {
    const cacheKey = `${from}_${to}`;
    const cachedRate = await cache.get(cacheKey);

    // Return cached rate if available
    if (cachedRate) {
        return cachedRate;
    }

    try {
        const response = await axios.get(`${config.EXCHANGE_API_URL}/${from}`, {
            headers: {
                'Authorization': `Bearer ${config.API_KEY}` // Use API key in the headers
            }
        });
        
        const rate = response.data.rates[to];

        // Check if the rate is valid
        if (!rate) {
            throw new Error('Invalid currency code');
        }

        // Store the rate in cache
        await cache.set(cacheKey, rate);
        return rate;
    } catch (error) {
        throw new Error(`Error fetching exchange rate: ${error.message}`);
    }
};

module.exports = { getExchangeRate };