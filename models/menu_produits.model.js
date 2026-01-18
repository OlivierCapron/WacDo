const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const Menu = require('./menu.model');
const Produit = require('./produit.model');

const MenuProduit = sequelize.define('MenuProduit', {
  menu_produits_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  menu_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: Menu, key: 'menu_id' }
  },
  produit_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: Produit, key: 'produit_id' }
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'menu_produits'
});



module.exports = MenuProduit;
