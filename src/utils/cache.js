const redis = require('redis');
const { promisify } = require('util');
const { CACHE_EXPIRY } = require('../config/config');

// Create and configure the Redis client
const client = redis.createClient({
    host: 'redis',
    url: process.env.REDIS_URL || 'redis://redis:6379'
});

// Connect to Redis
(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis', err);
    }
})();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// to solve deadlock issue
// Using native async methods
const getWithTimeout = async (key, timeout = 5000) => { //5 sec timeout
    try {
        // Race between Redis GET and a timeout
        const value = await Promise.race([
            client.get(key),
            new Promise((resolve) =>
                setTimeout(() => resolve(null), timeout)
            )
        ]);
        return value !== null ? value : false;
    } catch (error) {
        console.error('Error getting value from cache:', error);
        return false;
    }
};

const setWithTimeout = async (key, value, timeout = 5000) => { //5 sec timeout
    try {
        // Race between Redis SET and a timeout
        const result = await Promise.race([
            client.set(key, value, 'EX', CACHE_EXPIRY),
            new Promise((resolve) =>
                setTimeout(() => resolve('Timeout: Value not set'), timeout)
            )
        ]);
        return result;
    } catch (error) {
        console.error('Error setting value in cache:', error);
        return 'Error: Value not set';
    }
};

const cache = {
    // get data from cache
    get: async (key) => {
        return await getWithTimeout(key);
    },
    // set data in cache
    set: async (key, value) => {
        return await setWithTimeout(key, value ,CACHE_EXPIRY);
    },
    client
};

module.exports = cache;