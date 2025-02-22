const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Properties = require('../model/Poroperty');
const path = require('path');

// Register a new property
const registerProperty = async (req, res) => {
    try {
        console.log('Starting property registration...');
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        // Log the received data
        console.log('Files:', req.files);
        console.log('Body:', req.body);

        // Validate required fields
        const { title, description, location, price, property_type } = req.body;
        
        if (!title || !description || !location || !price) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: { title, description, location, price }
            });
        }

        // Update image path handling - store only the filename
        const images = req.files.map(file => file.filename);

        // Create property with validated data
        const propertyData = {
            title,
            description,
            owner_id: 1,
            price: parseFloat(price),
            location,
            total_capacity: 1,
            is_available: true,
            image: images,
            property_type,
            facilities: req.body.facilities ? JSON.parse(req.body.facilities) : []
        };

        console.log('Attempting to create property with data:', propertyData);

        const newProperty = await Properties.create(propertyData);
        console.log('Property created successfully:', newProperty.id);

        res.status(201).json({
            message: 'Property registered successfully',
            property: newProperty,
            imageUrls: images.map(img => `http://localhost:5000/uploads/${img}`)
        });

    } catch (error) {
        console.error('Property registration error:', error);
        return res.status(500).json({ 
            error: 'Failed to register property',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

//view all property
const viewAllProperty = async (req, res) => {
    try {
        const properties = await Properties.findAll();
        
        // Transform the image paths to full URLs
        const propertiesWithUrls = properties.map(property => {
            const propertyData = property.toJSON();
            if (propertyData.image && Array.isArray(propertyData.image)) {
                propertyData.image = propertyData.image.map(img => 
                    `http://localhost:5000/uploads/${img}`
                );
            }
            return propertyData;
        });

        res.status(200).json(propertiesWithUrls);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
}

module.exports = { registerProperty, viewAllProperty };