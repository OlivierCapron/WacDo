/**
 * Tests des U Clients 
 */



const request = require('supertest');
const { sequelize } = require('../config/database');
const { app } = require('../app');
const Categorie = require('../models/categorie.model');
const LigneCommande = require("../models/lignes_commandes.model");
const Article = require("../models/article.model");
const Menu = require("../models/menu.model");
const Produit = require("../models/produit.model");

const Commande = require("../models/commande.model");
const Client = require('../models/client.model');

const Utilisateur = require('../models/utilisateur.model');


jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    // On mcok un Admin
    req.utilisateur = { utilisateurId: 1, identifiant:'test@wacdo.fr', motDePasse:'Password123',role: 'ADMINISTRATION' };
    next();
  };
});


describe('Tests API /api/commandes/:id/lignes', () => {
  let clientCree;
  let produitCree;
  let menuCree;
  let categorieCree;
  let commandeCree;
  let ligneProduitCree;
  let ligneMenuCree;
  let utilisateurCree;
  let utilisateurToken;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.sync({ force: true });

    utilisateurCree =  await Utilisateur.create({
  identifiant: 'test@wacdo.fr',
  motDePasse: 'Password123',
  role: 'ADMINISTRATION'
});


    // Crée un client pour la commande
    clientCree = await Client.create({ nom: 'Client Test' });

   categorieCree = await Categorie.create({nom: 'BURGER'});
   
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
  commandeCree = await request(app)
  .post('/api/commandes')
  .set('Authorization', `Bearer ${utilisateurToken}`)
  .send({
    client_id: clientCree.client_id,
    origine: 'COMPTOIR'
  });
});
  /**
   * Ajout d'une ligne de commande
   */
  test('POST /api/commandes/:id/lignes : Ajout ligne de commande', async () => {
    const addProduitToCommande = await request(app)
      .post(`/api/commandes/${commandeCree.body.commande_id}/lignes`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        article_id: produitCree.body.produit_id,
        quantite: 2
      });


      
    expect(addProduitToCommande.statusCode).toBe(201);
    expect(addProduitToCommande.body).toHaveProperty('message', 'Ligne de commande ajoutée');
    expect(addProduitToCommande.body.ligne).toHaveProperty('commande_id', String(commandeCree.body.commande_id));
    expect(addProduitToCommande.body.ligne).toHaveProperty('article_id', produitCree.body.produit_id);
    expect(addProduitToCommande.body.ligne).toHaveProperty('quantite', 2);
    expect(addProduitToCommande.body.ligne).toHaveProperty('total', 17.00); // 2*8.5 
    expect(addProduitToCommande.body.ligne).toHaveProperty('total_ttc', 20.4); 

    ligneProduitCree = addProduitToCommande.body.ligne;

    const addMenuToCommande = await request(app)
      .post(`/api/commandes/${commandeCree.body.commande_id}/lignes`)
      .set('Authorization', `Bearer ${utilisateurToken}`)
      .send({
        article_id: menuCree.body.menu_id,
        quantite: 3
   });


    console.log(addMenuToCommande.body);


    expect(addMenuToCommande.statusCode).toBe(201);
    expect(addMenuToCommande.body).toHaveProperty('message', 'Ligne de commande ajoutée');
    expect(addMenuToCommande.body.ligne).toHaveProperty('commande_id',String(commandeCree.body.commande_id));
    expect(addMenuToCommande.body.ligne).toHaveProperty('article_id',menuCree.body.menu_id);
    expect(addMenuToCommande.body.ligne).toHaveProperty('quantite', 3);
    expect(addMenuToCommande.body.ligne).toHaveProperty('total', 55.5); // (3*18.5)
    expect(addMenuToCommande.body.ligne).toHaveProperty('total_ttc', 66.6); 

    ligneMenuCree = addMenuToCommande.body.ligne;
  });

  /**
   * verifie que la ligne est biencréée 
   */
  test('GET Vérification en base : Ligne existe', async () => {
    const ligneProduit = await LigneCommande.findByPk(ligneProduitCree.ligne_commande_id);
    expect(ligneProduit).not.toBeNull();
    expect(ligneProduit.commande_id).toBe(commandeCree.body.commande_id);

    const ligneMenu = await LigneCommande.findByPk(ligneMenuCree.ligne_commande_id);
    expect(ligneMenu).not.toBeNull();
    expect(ligneMenu.commande_id).toBe(commandeCree.body.commande_id);

  });

  /**
   * suppression d'une ligne 
   */
  test('DELETE /api/commandes/:id/lignes/:ligneId : Suppression ligne', async () => {
    const resProduit = await request(app)
    .delete(`/api/commandes/${commandeCree.body.commande_id}/lignes/${ligneProduitCree.ligne_commande_id}`)
    .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(resProduit.statusCode).toBe(200);
    expect(resProduit.body).toHaveProperty('message', 'Ligne de commande supprimée avec succès');

    const resMenu = await request(app)
    .delete(`/api/commandes/${commandeCree.body.commande_id}/lignes/${ligneMenuCree.ligne_commande_id}`)
    .set('Authorization', `Bearer ${utilisateurToken}`);

    expect(resMenu.statusCode).toBe(200);
    expect(resMenu.body).toHaveProperty('message', 'Ligne de commande supprimée avec succès');
  });

  /**
   * 🧪 Vérifie que la ligne n’existe plus
   */
  test('GET Vérification en base : Ligne supprimée', async () => {
    const ligneProduit = await LigneCommande.findByPk(ligneProduitCree.ligne_commande_id);
    expect(ligneProduit).toBeNull();
        const ligneMenu = await LigneCommande.findByPk(ligneMenuCree.ligne_commande_id);
    expect(ligneMenu).toBeNull();

  });

  afterAll(async () => {
    await sequelize.close();
  });
});