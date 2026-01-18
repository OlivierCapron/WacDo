const { sequelize } = require('../config/database');

const { DataTypes } = require('sequelize');          

const Option = sequelize.define('Option', {
  option_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  description: { 
    type: DataTypes.STRING(1024), 
    allowNull: true 
  },
  prix: { 
    type: DataTypes.DECIMAL(8, 2), 
    allowNull: true 
  },
  image: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  disponible: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: true 
  },
}, {
  tableName: 'option'
});

module.exports = Option;
