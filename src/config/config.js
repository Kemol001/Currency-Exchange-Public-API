require('dotenv').config();

const config = {
    EXCHANGE_API_URL: process.env.EXCHANGE_API_URL || 'https://api.exchangerate-api.com/v4/latest',
    API_KEY: process.env.API_KEY || '',
    CACHE_EXPIRY: process.env.CACHE_EXPIRY || 3600,
};

module.exports = config;