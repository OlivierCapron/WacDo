const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');          

const Utilisateur = sequelize.define('Utilisateur', {
  utilisateur_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  identifiant: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  motDePasse: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.ENUM('ADMINISTRATION', 'PREPARATION', 'ACCUEIL'),
    allowNull: false 
  },
}, {
  tableName: 'utilisateur'
});

module.exports = Utilisateur;