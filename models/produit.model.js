const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Article = require('./article.model');
const Categorie = require('./categorie.model');

const Produit = sequelize.define('Produit', {
  article_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: {
      model: Article,
      key: 'article_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  categorie_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Categorie,
      key: 'categorie_id'
    }
  }
}, {
  tableName: 'produit',
  timestamps: false,
  underscored: true
});


module.exports = Produit;