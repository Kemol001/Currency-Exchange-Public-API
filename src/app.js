const express = require('express');
const cors = require('cors');
const currencyRoutes = require('./routes/currencyRoutes');
const errorHandler = require('./middlewares/errorHandler');

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

module.exports = app;