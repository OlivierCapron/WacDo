/**
 * Tests des Commandes
 */

const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');
const Categorie = require('../models/categorie.model');
const Utilisateur = require('../models/utilisateur.model');

let utilisateurToken;
let categorieCree;

jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    // On mcok un Admin
    req.utilisateur = { utilisateurId: 1, identifiant: 'test@wacdo.fr', motDePasse: 'Password123', role: 'ADMINISTRATION' };
    next();
  };
});


beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.drop();
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  await sequelize.sync({ force: true });
});


afterAll(async () => {
  await sequelize.close();
});

describe('Tests API /api/categories', () => {

  test('POST /api/categories : Création catégorie', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        nom: 'BURGERS'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('nom', 'BURGERS');
    categorieCree = res.body;
  });

  test('GET /api/categories : Liste des catégories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('nom', 'BURGERS');
  });

  test('PUT /api/categories/:id : Modification catégorie', async () => {
    const res = await request(app)
      .put(`/api/categories/${categorieCree.categorie_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        nom: 'PIZZA'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nom', 'PIZZA');
  });

  test('DELETE /api/categories/:id : Suppression catégorie', async () => {
    const res = await request(app)
      .delete(`/api/categories/${categorieCree.categorie_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Catégorie supprimée avec succès.');
  });
});