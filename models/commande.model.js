const { sequelize } =  require('../config/database');
const { DataTypes } = require('sequelize');        
  
const Produit = require('./produit.model');
const Client = require('./client.model');
const Utilisateur = require('./utilisateur.model');

 const Commande = sequelize.define('Commande', {
    commande_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Client,
        key: 'client_id'
      }
    },
    tstamp_commande_cree: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tstamp_commande_preparee: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tstamp_commande_livree: {
      type: DataTypes.DATE,
      allowNull: true
    },
    statut: {
      type: DataTypes.ENUM('BROUILLON','A_PREPARER', 'PREPAREE', 'LIVREE'),
      allowNull: false,
      defaultValue: 'A_PREPARER'
    },
    origine: {
      type: DataTypes.ENUM('COMPTOIR', 'TELEPHONE'),
      allowNull: false
    },
    prix_total: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    prix_total_ttc: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    commande_createur_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Utilisateur,
        key: 'utilisateur_id'
      }
    },
    commande_preparateur_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: Utilisateur,
        key: 'utilisateur_id'
      }
    },
    commande_livreur_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: Utilisateur,
        key: 'utilisateur_id'
      }
    }
  }, {
    tableName: 'commande'
  });

module.exports = Commande;
