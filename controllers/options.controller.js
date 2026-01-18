

const Option = require("../models/option.model");
/**
 * GET /api/options
 * 🔹 Récupérer toutes les options
 */
exports.getOptions = async (req, res) => {
  try {
    const options = await Option.findAll();
    return res.status(200).json(options);
  } catch (err) {
    console.error('Erreur lors de la récupération des options:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};



/**
 * POST /api/options
 * 🔹 Créer une nouvelle option
 */
exports.createOption = async (req, res) => {
  try {
    const { nom, description, prix, image, disponible } = req.body;

    // Vérification des champs requis
    if (!nom) return res.status(400).json({ message: 'Le nom est obligatoire' });

    // Création
    const option = await Option.create({
      nom,
      description,
      prix,
      image,
      disponible
    });

    return res.status(201).json(option);
  } catch (err) {
    console.error('Erreur lors de la création de l’option:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * PUT /api/options/:id
 * 🔹 Modifier une option existante
 */
exports.editOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, prix, image, disponible } = req.body;

    const option = await Option.findByPk(id);
    if (!option) return res.status(404).json({ message: 'Option non trouvée' });

    await option.update({
      nom: nom ?? option.nom,
      description: description ?? option.description,
      prix: prix ?? option.prix,
      image: image ?? option.image,
      disponible: disponible ?? option.disponible
    });

    return res.status(200).json({
      message: 'Option mise à jour avec succès',
      option
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l’option:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * DELETE /api/options/:id
 * 🔹 Supprimer une option
 */
exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await Option.findByPk(id);

    if (!option) return res.status(404).json({ message: 'Option non trouvée' });

    await option.destroy();
    return res.status(200).json({ message: 'Option supprimée avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l’option:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};
