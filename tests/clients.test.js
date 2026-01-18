/**
 * Tests des Clients
 */



const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');
const Client = require('../models/client.model');

jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    // On mock un Admin
    req.utilisateur = { utilisateurId: 1, identifiant: 'test@wacdo.fr', motDePasse: 'Password123', role: 'ADMINISTRATION' };
    next();
  };
});


describe('Tests API /api/clients', () => {
  let clientCree;
  let utilisateurToken;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.sync({ force: true });
  });

  // CREATE
  test('POST /api/clients : Création client', async () => {
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        nom: 'Dupont SARL'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('nom', 'Dupont SARL');
    clientCree = res.body;
  });

  // READ (liste)
  test('GET /api/clients : Liste des clients', async () => {
    const res = await request(app)
      .get('/api/clients')
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('nom', 'Dupont SARL');
  });

  // READ (par ID)
  test('GET /api/clients/:id : Client par ID', async () => {
    const res = await request(app)
      .get(`/api/clients/${clientCree.client_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nom', 'Dupont SARL');
  });

  // UPDATE
  test('PUT /api/clients/:id : Modification client', async () => {
    const res = await request(app)
      .put(`/api/clients/${clientCree.client_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        nom: 'Dupont & Fils'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.client).toHaveProperty('nom', 'Dupont & Fils');
  });

  // DELETE
  test('DELETE /api/clients/:id : Suppression client', async () => {
    const res = await request(app)
      .delete(`/api/clients/${clientCree.client_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Client supprimé avec succès');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
