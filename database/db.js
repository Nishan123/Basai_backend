const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('basai', 'postgres', 'lamakhu', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false, // Disable SQL query logging
});

// Remove the test connection and sync
module.exports = sequelize;