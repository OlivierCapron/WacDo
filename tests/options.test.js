/**
 * Tests API /api/options (CRUD)
 */

const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');
const Option = require('../models/option.model');

jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.utilisateur = { utilisateurId: 1, identifiant: 'admin@wacdo.fr', role: 'ADMINISTRATION' };
    next();
  };
});

describe('Tests API /api/options', () => {
  let optionCree;
  let utilisateurToken; 

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.sync({ force: true });
  });

  test('POST /api/options : Création option', async () => {
    const res = await request(app)
      .post('/api/options')
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        nom: 'Sauce fromagère',
        description: 'Sauce au cheddar',
        prix: 0.80,
        image: 'https://toto.com/sauce.jpg',
        disponible: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('nom', 'Sauce fromagère');
    expect(res.body).toHaveProperty('prix', 0.80);
    expect(res.body).toHaveProperty('disponible', true);
    optionCree = res.body;
  });

  test('GET /api/options : Liste des options', async () => {
    const res = await request(app)
      .get('/api/options')
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('nom', 'Sauce fromagère');
  });


  test('PUT /api/options/:id : Modification d’une option', async () => {
    const res = await request(app)
      .put(`/api/options/${optionCree.option_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        description: 'Une sauce cheddar améliorée avec herbes',
        prix: 1.20
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.option).toHaveProperty('prix', 1.20);
    expect(res.body.option).toHaveProperty('description', 'Une sauce cheddar améliorée avec herbes');
  });

  test('DELETE /api/options/:id : Suppression d’une option', async () => {
    const res = await request(app)
      .delete(`/api/options/${optionCree.option_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Option supprimée avec succès');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
