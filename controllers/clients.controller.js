
const Client = require("../models/client.model");


/**
 * GET /api/clients
 * 🔹 Récupérer tous les clients
 */
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    return res.status(200).json(clients);
  } catch (err) {
    console.error('Erreur lors de la récupération des clients:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * GET /api/clients/:id
 * 🔹 Récupérer un client par ID
 */
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    return res.status(200).json(client);
  } catch (err) {
    console.error('Erreur lors de la récupération du client:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * POST /api/clients
 * 🔹 Créer un nouveau client
 */
exports.createClient = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom du client est obligatoire' });

    const client = await Client.create({ nom });
    return res.status(201).json(client);
  } catch (err) {
    console.error('Erreur lors de la création du client:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * PUT /api/clients/:id
 * 🔹 Modifier un client existant
 */
exports.editClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });

    await client.update({ nom: nom ?? client.nom });

    return res.status(200).json({
      message: 'Client mis à jour avec succès',
      client
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du client:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * DELETE /api/clients/:id
 * 🔹 Supprimer un client
 */
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });

    await client.destroy();
    return res.status(200).json({ message: 'Client supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du client:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};