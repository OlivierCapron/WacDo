const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');          

const Client = sequelize.define('Client', {
  client_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
}, {
  tableName: 'client'
});

module.exports = Client;