
const Produit = require("../models/produit.model");
const Menu = require("../models/menu.model");
const Option = require("../models/option.model");
const Categorie = require("../models/categorie.model");
const Article = require("../models/article.model");



/**
 * Récupérer la liste complète des menus
 * WS: router.get('/', auth, getProduits);
 */
exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: [{ model: Article, as: 'article_menu' }]
    });

    const result = menus.map(menu => ({
      menu_id: menu.article_id,
      nom: menu.article_menu?.nom,
      description: menu.article_menu?.description,
      disponible: menu.article_menu?.disponible,
      prix: menu.article_menu?.prix,
     
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error('Erreur lors de la récupération des menus:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * GET /api/menus/:id
 * Détail d’un menu a parti r de son id
 */
exports.getMenuDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id, {
      include: [{ model: Article, as: 'article_menu' }]
    });

    if (!menu) return res.status(404).json({ message: 'Menu non trouvé' });

    const result = {
      menu_id: menu.article_id,
      nom: menu.article_menu.nom,
      description: menu.article_menu.description,
      prix: menu.article_menu.prix,
      disponible: menu.article_menu.disponible,
      // produits: menu.produits.map(p => ({
      //   produit_id: p.article_id,
      //   nom: p.article_produit.nom,
      //   prix: p.article_produit.prix
      // })),
      // options: menu.options
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Erreur lors de la récupération du menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * POST /api/menus
 * Création d’un nouveau menu
 */
exports.createMenu = async (req, res) => {
  try {
    const { nom, description, prix, disponible } = req.body;

    const article = await Article.create({
      nom,
      description,
      prix,
      disponible,
      type: 'MENU'
    });

    const menu = await  Menu.create({
      article_id: article.article_id,
    });

    return res.status(201).json({
      menu_id: menu.article_id,
      nom: article.nom,
      description: article.description,
      prix: article.prix,
      disponible: article.disponible,
    });
  } catch (err) {
    console.error('Erreur lors de la création du menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * /api/menus/:id PUT
 * Modifier un menu
 */
exports.editMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, prix, disponible } = req.body;

    const menu = await Menu.findByPk(id, {
      include: [{ model: Article, as: 'article_menu' }]
    });
    if (!menu) return res.status(404).json({ message: 'Menu non trouvé' });

    await menu.article_menu.update({
      nom: nom ?? menu.article_menu.nom,
      description: description ?? menu.article_menu.description,
      prix: prix ?? menu.article_menu.prix,
      disponible: disponible ?? menu.article_menu.disponible
    });

    return res.status(200).json({
      message: 'Menu mis à jour avec succès',
      menu: {
        menu_id: menu.article_id,
        nom: menu.article_menu.nom,
        description: menu.article_menu.description,
        prix: menu.article_menu.prix,
        disponible: menu.article_menu.disponible
      }
    });
  } catch (err) {
      console.error('Erreur lors de la mise à jour du menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

///
/* DELETE /api/menus/:id
 * Supprimer 
 * 
 * 
 */
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (!menu) return  res.status(404).json({ message: 'Menu non trouvé' });

    await menu.destroy();


    return res.status(200).json({   message: 'Menu supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};


/**
 * GESTION DES Produits dans le menu
 * POST /api/menus/:id/produits
 * Ajouter un produit à un menu
 */
exports.addProduitToMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { produitId } = req.body;

    const menu = await Menu.findByPk(id);
    const produit = await Produit.findByPk(produitId);
    if (!menu || !produit) return res.status(404).json({ message: 'Menu ou produit non trouvé' });

    await menu.addProduitToMenu(produit);

    return res.status(201).json({ message: 'Produit ajouté au menu avec succès' });
  } catch (err) {
    console.error('Erreur lors de l’ajout du produit au menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * DELETE /api/menus/:id/produits/:produitId
 * Retirer un produit d’un menu
 */
exports.removeProduitFromMenu = async (req, res) => {
  try {
    const { id, produitId } = req.params;

    const menu = await Menu.findByPk(id);
    const produit = await Produit.findByPk(produitId);
    if (!menu || !produit) return res.status(404).json({ message: 'Menu ou produit non trouvé' });

    await menu.removeProduitFromMenu(produit);

    return res.status(200).json({ message: 'Produit retiré du menu avec succès' });
  } catch (err) {
    console.error('Erreur lors du retrait du produit du menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * 
 *  * GESTION DES Options dans le menu


 * POST /api/menus/:id/options
 * Ajouter une option à un menu
 */
exports.addOptionToMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;

    const menu = await Menu.findByPk(id);
    if (!menu ) return res.status(404).json({ message: 'Menu non trouvé' });

    const option = await Option.findByPk(optionId);
    if (!!option) return res.status(404).json({ message: 'Option non trouvé' });

    await menu.addOptionToMenu(option);

    return res.status(201).json({ message: 'Option ajoutée au menu avec succès' });
  } catch (err) {
    console.error('Erreur lors de l’ajout d’une option au menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * DELETE /api/menus/:id/options/:optionId
 * Retirer une option d’un menu
 */
exports.removeOptionFromMenu = async (req, res) => {
  try {
    const { id, optionId } = req.params;

    const menu = await Menu.findByPk(id);
    const option = await Option.findByPk(optionId);
    if (!menu || !option) return res.status(404).json({ message: 'Menu ou option non trouvé' });

    await menu.removeOptionFromMenu(option);

    return res.status(200).json({ message: 'Option retirée du menu avec succès' });
  } catch (err) {
    console.error('Erreur lors du retrait de l’option du menu:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};