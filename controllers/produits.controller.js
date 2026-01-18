
const Produit = require("../models/produit.model");
const Categorie = require("../models/categorie.model");
const Article = require("../models/article.model");


/**
 * Récupérer la liste complète des produits
 * WS: router.get('/', auth, getProduits);
 */
exports.getProduits = async (req, res) => {
  try {
    const produits = await Produit.findAll({
      include: [
        {
          model: Article,
          as: 'article_produit', // doit correspondre à ton alias dans associations.js
          attributes: ['article_id', 'nom', 'description', 'prix', 'disponible', 'type']
        },
        {
          model: Categorie,
          as: 'categorie', // pareil, doit correspondre à ton alias
          attributes: ['categorie_id', 'nom']
        }
      ]
    });

    // On refabrique la structure pour matcher le JSON attendu (comme createProduit)
    const produitsComplets = produits.map(p => ({
      produit_id: p.article_id,
      nom: p.article_produit?.nom,
      description: p.article_produit?.description,
      prix: p.article_produit?.prix,
      disponible: p.article_produit?.disponible,
      categorie_id: p.categorie_id,
      categorie_nom: p.categorie?.nom
    }));

    return res.status(200).json(produitsComplets);
  } catch (err) {
    console.error("Erreur lors de la récupération des produits:", err);
    return res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
};




/**
 * Récupérer le détail d’un produit
 * WS: router.get('/:id', auth, getProduitDetails);
 **/


exports.getProduitDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const produit = await Produit.findByPk(id, {
      include: [
        {
          model: Article,
          as: 'article_produit', // alias défini dans associations.js
          attributes: ['article_id', 'nom', 'description', 'prix', 'disponible', 'type']
        },
        {
          model: Categorie,
          as: 'categorie',
          attributes: ['categorie_id', 'nom']
        }
      ]
    });

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Fusionner les infos article + produit
    const produitComplet = {
      produit_id: produit.article_id,
      nom: produit.article_produit?.nom,
      description: produit.article_produit?.description,
      prix: produit.article_produit?.prix,
      disponible: produit.article_produit?.disponible,
      categorie_id: produit.categorie_id,
      categorie_nom: produit.categorie?.nom
    };

    return res.status(200).json(produitComplet);
  } catch (err) {
    console.error("Erreur lors de la récupération du produit:", err);
    return res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
};


/**
 * Créer un nouveau produit
 * WS: router.post('/', auth, createProduit);
 */
exports.createProduit = async (req, res) => {
  try {
    const { nom, description, prix , categorie, disponible } = req.body;

    const categorieExiste = await Categorie.findByPk(categorie);
    if (!categorieExiste) {
      return res.status(400).json({ error: "Catégorie invalide" });
    }

    // Article parent
    const article = await Article.create({
      nom,
      description,
      prix,
      disponible: disponible,
      type: 'PRODUIT'
    });

    // PRoduit
    const produit = await Produit.create({
      article_id: article.article_id,
      categorie_id: categorieExiste.categorie_id
    });

    // On renvoir le produit complet
    const produitComplet = {
      produit_id: produit.article_id,
      nom: article.nom,
      description: article.description,
      prix: article.prix,
      disponible: article.disponible,
      categorie_id: produit.categorie_id
    };


    return res.status(201).json(produitComplet);
  } catch (err) {
    console.error("--> Erreur lors de la cr éation du produit  :", err);
    return res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
};

/**
 * Modifier un produit existant
 * WS: router.put('/:id', auth, editProduit);
 */
exports.editProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, prix, categorie, disponible } = req.body;

    // Charger le produit avec son article et sa catégorie
    const produit = await Produit.findByPk(id, {
      include: [
        { model: Article, as: 'article_produit' },
        { model: Categorie, as: 'categorie' }
      ]
    });

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // 🔹 Mise à jour de la catégorie si changée
    if (categorie) {
      const categorieExiste = await Categorie.findByPk(categorie);
      if (!categorieExiste) {
        return res.status(400).json({ error: "Catégorie invalide" });
      }
      produit.categorie_id = categorieExiste.categorie_id;
    }

    // 🔹 Mise à jour des infos de l’article parent
    await produit.article_produit.update({
      nom: nom ?? produit.article_produit.nom,
      description: description ?? produit.article_produit.description,
      prix: prix ?? produit.article_produit.prix,
      disponible: disponible ?? produit.article_produit.disponible
    });

    // 🔹 Sauvegarde du produit (pour la catégorie notamment)
    await produit.save();

    // 🔹 Reformatage de la réponse
    const produitComplet = {
      produit_id: produit.article_id,
      nom: produit.article_produit.nom,
      description: produit.article_produit.description,
      prix: produit.article_produit.prix,
      disponible: produit.article_produit.disponible,
      categorie_id: produit.categorie_id,
      categorie_nom: produit.categorie?.nom || null
    };

    return res.status(200).json({
      message: "Produit mis à jour avec succès",
      produit: produitComplet
    });

  } catch (err) {
    console.error("Erreur lors de la mise à jour du produit:", err);
    return res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
};

/**
 * Supprimer un produit
 * WS: router.delete('/:id', auth, deleteProduit);
 */
exports.deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const produit = await Produit.findByPk(id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    await produit.destroy();
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du produit:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
};
