const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');


const LigneCommande = sequelize.define('LigneCommande', {
  ligne_commande_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  commande_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  article_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  total_ttc: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: 'ligne_commande',
});



module.exports = LigneCommande;
