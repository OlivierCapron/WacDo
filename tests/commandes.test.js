/**
 * Tests des Commandes 
 */

const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');


const LigneCommande = require("../models/lignes_commandes.model");
const Article = require("../models/article.model");
const Categorie = require("../models/categorie.model");
const Menu = require("../models/menu.model");
const Produit = require("../models/produit.model");
const Commande = require("../models/commande.model");
const Client = require('../models/client.model');
const Utilisateur = require('../models/utilisateur.model');


jest.mock('../middleware/auth', () => {
  const jwt = require('jsonwebtoken');
  const dotenv = require('dotenv');
  dotenv.config();

  return (req, res, next) => {
    const header = req.header('Authorization');

    // Si y a pas de header, on est dans le cas par defaut
    if (!header) {
      req.utilisateur = { role: 'ACCUEIL' }; 
      return next();
    }

    // Sinon on recupere le bon utilisateur en fonction du toke  passé
    const token = header.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.utilisateur = decoded;
      next();
    } catch (err) {
      console.error("Token invalide :", err.message);
      return res.status(401).json({ message: 'Token invalide' });
    }
  };
});



const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const admin = { utilisateurId: 99, identifiant: 'admin@wacdo.fr', motDePasse: 'Password123', role: 'ADMINISTRATION' };
const adminToken = jwt.sign(admin, process.env.JWT_SECRET);

describe('Tests API /api/commandes', () => {
  let clientCree;
  let commandeCree;
  let addProduitToCommande;
  let addMenuToCommande;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.sync({ force: true });


    // C réation des utilisateurs utilitaires aveec tous les roles
    await Utilisateur.bulkCreate([
      {
        utilisateur_id: 1,
        identifiant: 'admin@wacdo.fr',
        motDePasse: 'Password123!',
        role: 'ADMINISTRATION'
      }, {
        utilisateur_id: 2,
        identifiant: 'accueil@wacdo.fr',
        motDePasse: 'Password123!',
        role: 'ACCUEIL'
      },

      {
        utilisateur_id: 3,
        identifiant: 'preparation@wacdo.fr',
        motDePasse: 'Password123!',
        role: 'PREPARATION'
      }
    ]);

    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'secretdev';

    global.adminToken = jwt.sign(
      { utilisateurId: 1, identifiant: 'admin@wacdo.fr', role: 'ADMINISTRATION' }
      , secret
    );

    global.accueilToken = jwt.sign(
      { utilisateurId: 2, identifiant: 'accueil@wacdo.fr', role: 'ACCUEIL' },
      secret
    );

    global.preparationToken = jwt.sign(
      { utilisateurId: 3, identifiant: 'preparation@wacdo.fr', role: 'PREPARATION' },
      secret
    );


    // Crée tous les objets necessaires aux tests 
    clientCree = await Client.create({ nom: 'Jean Dupont' });

    categorieCree = await Categorie.create({ nom: 'BURGER' });

    utilisateurCree = await Utilisateur.create({
      identifiant: 'test@wacdo.fr',
      motDePasse: 'Password123',
      role: 'ADMINISTRATION'
    });

    produitCree = await request(app)
      .post('/api/produits')
      .send({
        nom: 'Burger Test',
        description: 'Burger de test',
        prix: 8.5,
        categorie: categorieCree.categorie_id,
        disponible: true
      });

    menuCree = await request(app)
      .post('/api/menus')
      .send({
        nom: 'Menu Test',
        description: 'Menu de test',
        prix: 18.5,
        disponible: true
      });


  });

  /**
   * Création d'une commande
   */
  test('POST /api/commandes : Création commande', async () => {
    commandeCree = await request(app)
      .post('/api/commandes')
      .set('Authorization', `Bearer ${accueilToken}`)
      .send({
        client_id: clientCree.client_id,
        origine: 'COMPTOIR'
      });

    expect(commandeCree.statusCode).toBe(201);
    expect(commandeCree.body).toHaveProperty('statut', 'BROUILLON');
    expect(commandeCree.body).toHaveProperty('client_id', clientCree.client_id);

    addProduitToCommande = await request(app)
      .post(`/api/commandes/${commandeCree.body.commande_id}/lignes`)
      .set('Authorization', `Bearer ${accueilToken}`)
      .send({
        article_id: produitCree.body.produit_id,
        quantite: 2
      });

    ligneProduitCree = addProduitToCommande.body.ligne;

    addMenuToCommande = await request(app)
      .post(`/api/commandes/${commandeCree.body.commande_id}/lignes`)
      .set('Authorization', `Bearer ${accueilToken}`)
      .send({
        article_id: menuCree.body.menu_id,
        quantite: 3
      });

    ligneMenuCree = addMenuToCommande.body.ligne;
  });

  /**
   * Toutes lescommandes
   */
  test('GET /api/commandes : Liste des commandes', async () => {
    const res = await request(app)
      .get('/api/commandes')
      .set('Authorization', `Bearer ${accueilToken}`);
    console.log("AAAA"+res.body)

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('statut');

    // On verifie qu'on a bien la commande creee juste anvat
    const commandeTrouvee = res.body.find(
      (commande) => Number(commande.commande_id) === Number(commandeCree.body.commande_id)


    );

    expect(commandeTrouvee).toBeDefined();
    expect(commandeTrouvee).toHaveProperty('statut', 'BROUILLON');
    expect(commandeTrouvee).toHaveProperty('commande_id', commandeCree.body.commande_id);

    expect(commandeTrouvee).toHaveProperty('client_id', clientCree.client_id);

  });

  /**
   * Commande par ID
   */
  test('GET /api/commandes/:id : Détail commande', async () => {
    const res = await request(app)
      .get(`/api/commandes/${commandeCree.body.commande_id}`)
      .set('Authorization', `Bearer ${accueilToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('client_id', clientCree.client_id);
  });

  /**
   * Modifi d'une commande
   */
  test('PUT /api/commandes/:id : Mise à jour commande', async () => {
    const res = await request(app)
      .put(`/api/commandes/${commandeCree.body.commande_id}`)
      .set('Authorization', `Bearer ${accueilToken}`)
      .send({
        statut: 'A_PREPARER',
        origine: 'TELEPHONE'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.commande).toHaveProperty('origine', 'TELEPHONE');
    expect(res.body.commande).toHaveProperty('statut', 'A_PREPARER');

    const res2 = await request(app)
      .put(`/api/commandes/${commandeCree.body.commande_id}`)
      .set('Authorization', `Bearer ${accueilToken}`)
      .send({
        statut: 'BROUILLON',
        origine: 'COMPTOIR'
      });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.commande).toHaveProperty('origine', 'COMPTOIR');
    expect(res2.body.commande).toHaveProperty('statut', 'BROUILLON');


  });

  /**
   * Valider une commande 
   */
  test('PUT /api/commandes/:id/declarerCommandeAPreparer : Valider commande', async () => {
    const res = await request(app)
      .put(`/api/commandes/${commandeCree.body.commande_id}/a-preparer`)
      .set('Authorization', `Bearer ${accueilToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.commande).toHaveProperty('statut', 'A_PREPARER');
  });

  /**
   *Liste des commandes à préparer
   */
  test('GET /api/commandes/liste/status-a-preparer : Commandes au status A_PREAPRER', async () => {
    const res = await request(app)
      .get('/api/commandes/liste/status-a-preparer')
      .set('Authorization', `Bearer ${accueilToken}`);

    // 403 car c'est un role PREPARATION qu'il faut
    expect(res.statusCode).toBe(403);

    const res2 = await request(app)
      .get('/api/commandes/liste/status-a-preparer')
      .set('Authorization', `Bearer ${preparationToken}`);

    // 200 car c'est un role PREPARATION qu'il faut
    expect(res2.statusCode).toBe(200);

  });

  /**
   * Déclarer Commande préparée
   */
  test('PUT /api/commandes/:id/preparee : Marquer préparée', async () => {
    const res = await request(app)
      .put(`/api/commandes/${commandeCree.body.commande_id}/preparee`)
      .set('Authorization', `Bearer ${accueilToken}`);

    // 403 car c'est un role PREPARATION qu'il faut
    expect(res.statusCode).toBe(403);

    const resCommpreparee = await request(app)
      .put(`/api/commandes/${commandeCree.body.commande_id}/preparee`)
      .set('Authorization', `Bearer ${preparationToken}`);

    // 200 car c'est un role PREPARATION qu'il faut
    expect(resCommpreparee.statusCode).toBe(200);


  });

  /**
   * Déclarer livrée
   */
  test('PUT /api/commandes/:id/livree : Marquer livrée', async () => {
    const res = await request(app)
      .put(`/api/commandes/${commandeCree.body.commande_id}/livree`)
      .set('Authorization', `Bearer ${accueilToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.commande).toHaveProperty('statut', 'LIVREE');
  });

  /**
   * Suppression d'une commande
   */
  test('DELETE /api/commandes/:id : Suppression commande', async () => {

     const resPreparationDelete = await request(app)
      .delete(`/api/commandes/${commandeCree.body.commande_id}`)
      .set('Authorization', `Bearer ${preparationToken}`);

      // CAr il faut un profil accueil ou Administration
    expect(resPreparationDelete.statusCode).toBe(403);


    const res = await request(app)
      .delete(`/api/commandes/${commandeCree.body.commande_id}`)
      .set('Authorization', `Bearer ${accueilToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Commande supprimée avec succès');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});




