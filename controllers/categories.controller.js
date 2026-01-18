
const Categorie = require("../models/categorie.model");



/**
 * GET /api/ categories
 * Liste de toutes les catégories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Erreur lors de la récupération des catégories:", err);
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

/**
 * POST /api/categories
 * Création d'une nouvelle catégorie
 */
exports.createCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Le nom de la catégorie est obligatoire." });
    }

    // Vérifie si la catégorie existe déjà
    const existing = await Categorie.findOne({ where: { nom } });
    if (existing) {
      return res.status(400).json({ error: "Une catégorie avec ce nom existe déjà." });
    }

    const nouvelleCategorie = await Categorie.create({
      nom,
      description: description || null,
    });

    res.status(201).json(nouvelleCategorie);
  } catch (err) {
    console.error("Erreur lors de la création de la catégorie:", err);
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

/**
 * PUT /api/categories/:id
 * Modification d’une catégorie existante
 */
exports.editCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    const categorie = await Categorie.findByPk(id);
    if (!categorie) {
      return res.status(404).json({ error: "Catégorie introuvable." });
    }

    categorie.nom = nom || categorie.nom;
    categorie.description = description || categorie.description;

    await categorie.save();
    res.status(200).json(categorie);
  } catch (err) {
    console.error("Erreur lors de la modification de la catégorie:", err);
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

/**
 * DELETE /api/categories/:id
 * Suppression d’une catégorie
 */
exports.deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    const categorie = await Categorie.findByPk(id);
    if (!categorie) {
      return res.status(404).json({ error: "Catégorie introuvable." });
    }

    await categorie.destroy();
    res.status(200).json({ message: "Catégorie supprimée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de la catégorie:", err);
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};