const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Article = require('./article.model');

const Menu = sequelize.define('Menu', {
  article_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Article,
      key: 'article_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'menu'
});


module.exports = Menu;
