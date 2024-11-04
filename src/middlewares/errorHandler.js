const errorHandler = (err, req, res, next) => {
    // Log detailed error information for debugging
    console.error('Error message:', err.message);
    console.error('Stack trace:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request method:', req.method);

    // If the response headers are already sent, delegate to the default error handler
    if (res.headersSent) {
        return next(err);
    }

    // Determine the status code
    const statusCode = err.status || 500; // Use the status code from the error or default to 500

    // Construct the error response
    const response = {
        error: 'Something went wrong!',
        status: statusCode
    };

    // HTTP status codes
    switch (statusCode) {
        case 400:
            response.error = 'Bad Request: The server could not understand the request due to invalid syntax.';
            break;
        case 401:
            response.error = 'Unauthorized: Access is denied due to invalid credentials.';
            break;
        case 403:
            response.error = 'Forbidden: You do not have permission to access this resource.';
            break;
        case 404:
            response.error = 'Not Found: The requested resource could not be found on this server.';
            break;
        case 408:
            response.error = 'Request Timeout: The server timed out waiting for the request.';
            break;
        case 429:
            response.error = 'Too Many Requests: You have sent too many requests in a given amount of time.';
            break;
        case 500:
            response.error = 'Internal Server Error: The server encountered an unexpected condition.';
            break;
        case 503:
            response.error = 'Service Unavailable: The server is not ready to handle the request.';
            break;
        default:
            response.error = err.message || 'Unexpected Error';
            break;
    }

    // Include the stack trace only in development mode
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Send the error response
    res.status(statusCode).json(response);
};

module.exports = errorHandler;