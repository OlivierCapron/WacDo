/**
 * Tests des U tilisateurs (CRUD + Authent)
 */

const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');
const Utilisateur = require('../models/utilisateur.model');

jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    // On mcok un Admin
    req.utilisateur = { utilisateurId: 1, identifiant:'test@wacdo.fr', motDePasse:'Password123',role: 'ADMINISTRATION' };
    next();
  };
});

describe('Tests /api/utilisateurs', () => {
  let utilisateurToken;
  let utilisateurCree;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.sync({ force: true });
  });

  test('POST /api/utilisateurs : Création utilisateur', async () => {
    const res = await request(app)
      .post('/api/utilisateurs')
      .set('Authorization', 'Bearer fake-token')
      .send({
        identifiant: 'test@wacdo.fr',
        motDePasse: 'Password123',
        role: 'ADMINISTRATION'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('identifiant', 'test@wacdo.fr');
    utilisateurCree = res.body;
  });

  test('POST /api/utilisateurs/auth/login : Authent', async () => {
    const res = await request(app)
      .post('/api/utilisateurs/auth/login')
      .send({
        identifiant: 'test@wacdo.fr',
        motDePasse: 'Password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.utilisateur.identifiant).toBe('test@wacdo.fr');
    utilisateurToken = res.body.token;
  });

  test('GET  /api/utilisateurs : Liste des users', async () => {
    const res = await request(app)
      .get('/api/utilisateurs')
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('identifiant', 'test@wacdo.fr');
  });

  test('GET /api/utilisateurs/:id : utilisateur par ID', async () => {
    const res = await request(app)
      .get(`/api/utilisateurs/${utilisateurCree.utilisateur_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('identifiant', 'test@wacdo.fr');
  });

  test('PUT /api/utilisateurs/:id : Modification d’un user', async () => {
    const res = await request(app)
      .put(`/api/utilisateurs/${utilisateurCree.utilisateur_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        motDePasse: 'NewPassword123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Utilisateur mis à jour avec succès');
  });

  test('DELETE  /api/utilisateurs/:id : Suppression d’un user', async () => {
    const res = await request(app)
      .delete(`/api/utilisateurs/${utilisateurCree.utilisateur_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');
  });


});
