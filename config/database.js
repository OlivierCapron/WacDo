const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

// Création de l'instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_SCHEMA,     
  process.env.DB_USER,        
  process.env.DB_PASSWORD,    
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    logging: false,
    logging: process.env.NODE_ENV === 'test' ? false : console.log, 
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`OK :  Connecté à MySQL (${process.env.NODE_ENV}) via Sequelize`);
  } catch (err) {
    console.error('Erreur connexion MySQL:', err);
  }
};

module.exports = { sequelize, connectDB };
