const { sequelize } =  require('../config/database');
const { DataTypes } = require('sequelize');          

const Article = sequelize.define('Article', {
  article_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('PRODUIT', 'MENU'),
    allowNull: false
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
  tableName: 'article'
});

module.exports = Article;
