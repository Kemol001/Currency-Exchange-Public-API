require('dotenv').config();

const config = {
    EXCHANGE_API_URL: process.env.EXCHANGE_API_URL || 'https://api.exchangerate-api.com/v4/latest',
    API_KEY: process.env.API_KEY || '',
};

module.exports = config;