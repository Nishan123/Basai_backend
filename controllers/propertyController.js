const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Properties = require('../model/Poroperty');

// Register a new property
const registerProperty = async (req, res) => {
    const { title, description, owner_id, price, location, total_capacity, is_available, image, property_type } = req.body;

    // Validate input
    if (!title || !description || !price || !location || !total_capacity || !image || !property_type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newProperty = await Properties.create({ title, description, owner_id, price, location, total_capacity, is_available, image, property_type });
        res.status(201).json({ message: 'Property registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register property' });
    }
}



//view all property
const viewAllProperty = async (req, res) => {
    try {
        const properties = await Properties.findAll();
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
}

module.exports = { registerProperty, viewAllProperty };