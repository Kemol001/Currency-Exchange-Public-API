const express = require('express');
const cors = require('cors');
const currencyRoutes = require('./routes/currencyRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Currency Exchange API!');
});
app.use('/api', currencyRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Currency Exchange API',
            version: '1.0.0',
            description: 'API to get currency exchange rates',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;