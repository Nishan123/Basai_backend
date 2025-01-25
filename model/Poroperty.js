const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../database/db');

const Property = sequelize.define('Properties', {

    property_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        notNull: true,
    },
    description: {
        type: DataTypes.STRING,
        notNull: true,

    },
    price: {
        type: DataTypes.INTEGER,
        notNull: true,
    },

    location: {
        type: DataTypes.STRING,
        notNull: true,
    },

    total_capacity: {
        type: DataTypes.INTEGER,
        notNull: true,

    },
    is_available: {
        type: DataTypes.BOOLEAN,
    },

    image: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    
    property_type: {
        type: DataTypes.STRING,
        notNull: true,
    },


})

module.exports = Property;