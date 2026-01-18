/**
 * Tests des U tilisateurs (CRUD + Authent)
 */

const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');
const Menu = require('../models/menu.model');
const Produit = require('../models/produit.model');
const Option = require('../models/option.model');
const Article = require('../models/article.model');
const Categorie = require('../models/categorie.model');
const Utilisateur = require('../models/utilisateur.model');
const { logger } = require('sequelize/lib/utils/logger');

jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    // On mcok un Admin
    req.utilisateur = { utilisateurId: 1, identifiant:'test@wacdo.fr', motDePasse:'Password123',role: 'ADMINISTRATION' };
    next();
  };
});



describe('Tests API /api/menus', () => {
  let menuCree;
  let categorieCree;
  let articleCree;
  let produitCree;
  let utilisateurToken;


    beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.sync({ force: true });
 

    categorieCree = await Categorie.create({
    nom: 'BURGERS'
  });

   const categorieExiste = await Categorie.findByPk(categorieCree.categorie_id);
    if (!categorieExiste) {
      return res.status(400).json({ error: "Catégorie invalide" });
    }


       // Article parent
    const articleCree = await Article.create({
      nom :"Big Mac",
      description : "Burger classique",
      prix : "9.99",
      disponible: true,
      type: 'PRODUIT'
    });

    // PRoduit
    const produitCree = await Produit.create({
      article_id: articleCree.article_id,
      categorie_id: categorieExiste.categorie_id
    });



 
  });

  test('POST /api/menus : Création menu', async () => {
    const resCreateMenu = await request(app)
      .post('/api/menus')
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        nom: 'Best Of BigMac',
        description: 'BigMac+ Boisson + Frites',
        prix: 15.50,
        disponible: true
     
      });

      
     expect(resCreateMenu.statusCode).toBe(201);
    expect(resCreateMenu.body).toHaveProperty('nom' , 'Best Of BigMac');
    expect(resCreateMenu.body).toHaveProperty('prix', 15.50);
    menuCree = resCreateMenu.body;
  });

  test('GET /api/menus :Les menus', async () => {
    const res = await request(app)
      .get('/api/menus')
      .set('Authorization', `Bearer ${utilisateurToken}`)

    expect(res.statusCode).toBe(200);
     expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('nom', 'Best Of BigMac');
  });

  test('GET /api/menus/:id :menu par id', async () => {
    const res = await request(app)
      .get(`/api/menus/${menuCree.menu_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nom', 'Best Of BigMac');
  });

  test('PUT /api/menus/:id : Modification d’un menu', async () => {
    const res = await request(app)
      .put(`/api/menus/${menuCree.menu_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        description: 'Menu classique :)',
        prix: 11.00
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.menu).toHaveProperty('prix', 11.00);
        expect(res.body.menu).toHaveProperty('description', 'Menu classique :)');

  });

  test('DELETE /api/menus/:id : Suppression d’un menu', async () => {
    const res = await request(app)
      .delete(`/api/menus/${menuCree.menu_id}`)
      .set('Authorization', `Bearer ${utilisateurToken}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Menu supprimé avec succès');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
