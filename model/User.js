const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../database/db');

const User = sequelize.define('Users',{

    user_id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    username: {
        type:DataTypes.STRING,
     },
    password: {
        type:DataTypes.STRING,
    }
})

module.exports = User;