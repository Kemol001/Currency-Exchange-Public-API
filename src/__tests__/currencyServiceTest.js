const currencyService = require('../services/currencyService');
const cache = require('../utils/cache');
const axios = require('axios');
const redis = require('redis');

// Mock the cache and axios
jest.mock('../utils/cache');
jest.mock('axios');

// Import the Redis client to close it after the tests
const client = require('../utils/cache').client;

describe('currencyService.getExchangeRate', () => {
    const mockFromCurrency = 'USD';
    const mockToCurrency = 'EGP';
    const mockRate = 30.5;
    const cacheKey = `${mockFromCurrency}_${mockToCurrency}`;

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        // Close the Redis client after all tests have run
        await client.quit();
    });

    it('should return a cached exchange rate if available', async () => {
        // Arrange: Mock the cache to return a value
        cache.get.mockResolvedValue(mockRate);

        // Act: Call the function
        const result = await currencyService.getExchangeRate(mockFromCurrency, mockToCurrency);

        // Assert: Check if the result matches the cached value
        expect(result).toBe(`From Cache: ${mockRate}`);
        expect(cache.get).toHaveBeenCalledWith(cacheKey);
        expect(axios.get).not.toHaveBeenCalled(); // Ensure API was not called
    });

    it('should fetch the exchange rate from the API if not in cache', async () => {
        // Arrange: Mock the cache to return null and the API to return a response
        cache.get.mockResolvedValue(null);
        axios.get.mockResolvedValue({ data: { rates: { [mockToCurrency]: mockRate } } });

        // Act: Call the function
        const result = await currencyService.getExchangeRate(mockFromCurrency, mockToCurrency);

        // Assert: Check if the result matches the API value
        expect(result).toBe(mockRate);
        expect(cache.get).toHaveBeenCalledWith(cacheKey);
        expect(axios.get).toHaveBeenCalledWith(
            `${process.env.EXCHANGE_API_URL}/${mockFromCurrency}`,
            {
                headers: { Authorization: `Bearer ${process.env.API_KEY}` }
            }
        );
        expect(cache.set).toHaveBeenCalledWith(cacheKey, mockRate);
    });

    it('should throw an error if the API response is invalid', async () => {
        // Arrange: Mock the cache to return null and the API to return an invalid response
        cache.get.mockResolvedValue(null);
        axios.get.mockResolvedValue({ data: { rates: {} } });

        // Act & Assert: Expect the function to throw an error
        await expect(currencyService.getExchangeRate(mockFromCurrency, mockToCurrency))
            .rejects
            .toThrow('Invalid currency code');

        expect(cache.get).toHaveBeenCalledWith(cacheKey);
        expect(axios.get).toHaveBeenCalled();
    });

    it('should throw an error if the API call fails', async () => {
        // Arrange: Mock the cache to return null and the API to throw an error
        cache.get.mockResolvedValue(null);
        axios.get.mockRejectedValue(new Error('API request failed'));

        // Act & Assert: Expect the function to throw an error
        await expect(currencyService.getExchangeRate(mockFromCurrency, mockToCurrency))
            .rejects
            .toThrow('Error fetching exchange rate: API request failed');

        expect(cache.get).toHaveBeenCalledWith(cacheKey);
        expect(axios.get).toHaveBeenCalled();
    });
});