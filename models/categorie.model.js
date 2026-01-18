const { sequelize } = require('../config/database');
const { DataTypes } =  require('sequelize');          

const Categorie = sequelize.define('Categorie', {
  categorie_id: {
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
  tableName: 'categorie'
});

module.exports = Categorie;
