const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const expressRateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/database'); 
const app = express();


console.log("server starting...");

app.use(express.json());
app.use(helmet());
app.use(cors());

// Pour pouvoir acceder aux fichiers uploadés
app.use(express.static('uploads'));


/* Max 100 requetes sur 15 minutes */
app.use(expressRateLimit(
  {
    windowMs:  15 * 60 * 1000,
    max : 100
  }
))

const setupSwagger = require('./swagger');

dotenv.config();

// Connexion MySQL
connectDB(); 


// Instanciation des tables
// Pas de confilt pour les tests 
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => console.log("Tables synchronisées !"))
    .catch(err => console.error("Erreur sync:", err));
}

// Chargement des associations
require('./models/associations');


app.use('/api/utilisateurs', require('./routes/utilisateurs.routes'));
app.use('/api/produits', require('./routes/produits.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/menus', require('./routes/menus.routes'));
app.use('/api/options', require('./routes/options.routes'));
app.use('/api/clients', require('./routes/clients.routes'));
app.use('/api/commandes', require('./routes/commandes.routes'));


setupSwagger(app);

if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => console.log('Server Running'));
}

module.exports = { app };