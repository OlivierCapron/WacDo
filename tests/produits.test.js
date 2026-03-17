/**
 * Tests des U tilisateurs (CRUD + Authent)
 */

const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');
const Produit = require('../models/produit.model');
const Article = require('../models/article.model');
const Categorie = require('../models/categorie.model');
const Utilisateur = require('../models/utilisateur.model');
const { logger } = require('sequelize/lib/utils/logger');

jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.utilisateur = {
      utilisateur_id: 1,
      identifiant: 'test@wacdo.fr',
      motDePasse: 'Password123',
      role: 'ADMINISTRATION'
    };
    next();
  };
});



describe('Tests API /api/produits', () => {
  let produitCree;
  let categorieCree;
  let utilisateurToken;


    beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    console.log("Reinit de la base de données");
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("base de données reinit");
    await sequelize.sync({ force: true });

     categorieCree = await Categorie.create({
    nom: 'BURGER'

  });

  });

  test('POST /api/produits : Création produit', async () => {
    const resCreationProduit = await request(app)
      .post('/api/produits')
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        nom: 'Big Mac',
        description: 'Un burger savoureux avec steak et fromage',
        prix: 8.50,
        categorie_id: categorieCree.categorie_id,
        disponible: true
     
      });


     expect(resCreationProduit.statusCode).toBe(201);
    expect(resCreationProduit.body).toHaveProperty('nom' , 'Big Mac');
    expect(resCreationProduit.body).toHaveProperty('prix', 8.50);
    expect(resCreationProduit.body).toHaveProperty('categorie_id',categorieCree.categorie_id);
    produitCree = resCreationProduit.body;
  });

  test('GET /api/produits :Les produits', async () => {
    const res = await request(app)
      .get('/api/produits')
      .set('Authorization', `Bearer ${utilisateurToken}`)

    expect(res.statusCode).toBe(200);
     expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('nom', 'Big Mac');
  });

  test('GET /api/produits/:id :Produit par id', async () => {
    const res = await request(app)
      .get(`/api/produits/${produitCree.produit_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nom', 'Big Mac');
  });

  test('PUT /api/produits/:id : Modification d’un produit', async () => {
    const res = await request(app)
      .put(`/api/produits/${produitCree.produit_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        description: 'Burger encore plus savoureux avec bacon',
        prix: 11.00
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.produit).toHaveProperty('prix', 11.00);
        expect(res.body.produit).toHaveProperty('description', 'Burger encore plus savoureux avec bacon');

  });

  test('DELETE /api/produits/:id : Suppression d’un produit', async () => {
    const res = await request(app)
      .delete(`/api/produits/${produitCree.produit_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Produit supprimé avec succès');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
