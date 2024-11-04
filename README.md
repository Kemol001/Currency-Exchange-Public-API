# Currency Exchange API

A simple API to get currency exchange rates, built using Node.js and Express. The API fetches exchange rates from an external currency API and caches the results using Redis to improve performance.

## Prerequisites
- **Node.js**: Make sure Node.js (version 12 or later) is installed on your system.
- **Docker**: If you plan to use Docker for running the application, ensure Docker and Docker Compose are installed.
- **Redis**: If running natively, ensure Redis is installed and running. You can find installation instructions for Redis [here](https://redis.io/docs/getting-started/installation/).

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/currency-exchange-api.git
cd currency-exchange-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
- Create a `.env` file in the root directory of the project and add the following:
```env
PORT=3000
EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest
API_KEY="Your API Key"
CACHE_EXPIRY=3600 # in seconds (e.g., 1 hour)
REDIS_URL=redis://localhost:6379 # Update this if your Redis server is hosted differently
```

### 4. Run the Application
- **Without Docker**:
```bash
npm start
```
- **With Nodemon (for development)**:
```bash
npm run dev
```

### 5. Access the API
- The API will be available at `http://localhost:3000`.
- The Currency Exchange endpoint is used at `http://localhost:3000/api/exchange-rate?from=USD&to=EGP`.
- Swagger documentation can be accessed at `http://localhost:3000/api-docs`.
---

## Using Docker

### 1. Build and Run the Application with Docker Compose
```bash
docker-compose up --build
```

### 2. Stopping the Docker Containers
```bash
docker-compose down
```

---

## API Endpoints

### 1. GET /api/exchange-rate
- **Description**: Retrieve the exchange rate between two currencies.
- **Query Parameters**:
  - `from` (required): The base currency code (e.g., USD)
  - `to` (required): The target currency code (e.g., EUR)
- **Response**:
```json
{
  "from": "USD",
  "to": "EUR",
  "rate": 0.85
}
```

### Error Handling
- **400 Bad Request**: Returned if required query parameters are missing.
- **500 Internal Server Error**: Returned if an error occurs on the server.

---

## Testing
- Run unit tests using Jest:
```bash
npm test
```

---

## Features
- **Rate Limiting**: Prevents abuse by limiting the number of requests per client.
- **Caching**: Uses Redis to cache exchange rates for faster responses and reduced load on the external API.
- **Swagger Documentation**: API documentation available at /api-docs.
---

## Additional Notes
- **Rate Limiting**: Configured to allow 100 requests per 15 minutes.
- **Caching**: Cached data in Redis expires after the specified duration set in the `.env` file (create one).