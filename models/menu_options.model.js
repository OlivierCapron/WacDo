const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Menu = require('./menu.model');
const Option = require('./option.model');

const MenuOption = sequelize.define('MenuOption', {
  menu_options_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  menu_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: Menu, key: 'article_id' }
  },
  option_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: Option, key: 'option_id' }
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'menu_options'
});



module.exports = MenuOption;
