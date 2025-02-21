//Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute')
const propertyRoute = require('./routes/propertyRoute')

//Creating a Server
const app = express();

//Creating a port
const PORT = process.env.PORT || 5000

// More detailed CORS configuration
app.use(cors({
    origin: '*',  // During development, accept all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health check route
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend server is running' });
});

app.use('/users', userRoute);
app.use('/properties', propertyRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server without database sync
app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
    console.log(`Test the server at http://localhost:${PORT}/test`);
});


