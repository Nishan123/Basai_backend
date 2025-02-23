//Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const propertyRoute = require('./routes/propertyRoute');
const bookingRoute = require('./routes/bookingRoute'); // Add this
const path = require('path');
const multer = require('multer'); // Add this if not already present

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

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files - add this before your routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add these headers for image serving
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

// Add CORS headers specifically for images
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Update the static file serving to use the root directory
app.use('/', express.static(path.join(__dirname)));

// Basic health check route
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend server is running' });
});

// Routes
app.use('/users', userRoute);
app.use('/properties', propertyRoute);
app.use('/api/bookings', bookingRoute); // Add this

// Add 404 handler before error handling middleware
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.url} not found`
    });
});

// Add this after your routes and before the general error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'File upload error',
            details: err.message
        });
    }
    
    res.status(500).json({ 
        error: 'Internal server error', 
        details: err.message 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Update the server startup
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        // Sync without dropping tables or forcing changes
        await sequelize.sync({ alter: false });
        console.log('Database synchronized.');
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', {
            name: error.name,
            message: error.message,
            detail: error.parent?.detail
        });
        process.exit(1);
    }
};

startServer();


