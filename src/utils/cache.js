const redis = require('redis');
const { promisify } = require('util');

// Create and configure the Redis client
const client = redis.createClient({
    url: process.env.REDIS_URL
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

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const cache = {
    // Method to get data from cache
    get: async (key) => {
        try {
            return await getAsync(key);
        } catch (error) {
            console.error('Error getting value from cache:', error);
            throw error; // Re-throw if you want to handle it later
        }
    },
    // Method to set data in cache
    set: async (key, value) => {
        try {
            return await setAsync(key, value);
        } catch (error) {
            console.error('Error setting value in cache:', error);
            throw error; // Re-throw if you want to handle it later
        }
    }
};

module.exports = cache;