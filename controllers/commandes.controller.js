const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});


const LigneCommande = require("../models/lignes_commandes.model");
const Article = require("../models/article.model");
const Menu = require("../models/menu.model");
const Produit = require("../models/produit.model");

const Commande = require("../models/commande.model");
const Client = require('../models/client.model');
const Utilisateur = require('../models/utilisateur.model');







/**
 * POST /api/commandes
 * 🔹 Créer une commande
 */
exports.createCommande = async (req, res) => {
  try {
    const { client_id, origine   } = req.body;

    if (!client_id) return res.status(400).json({ message: 'Le client est obligatoire' });

    const client = await Client.findByPk(client_id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });

    const utilisateurAuth = req.utilisateur;
    if (!utilisateurAuth || !utilisateurAuth.utilisateur_id)
    {
      return res.status(401).json({ message: 'Utilisateur non authentifié (token invalide)' });
    }
    const commande = await Commande.create({
      "client_id" : client_id,
      "tstamp_commande_cree" : new Date(), 
      "statut" : 'BROUILLON',
      "origine" : origine,
      "prix_total" : 0.0,
      "prix_total_ttc" : 0.0,
      "commande_createur_id" : utilisateurAuth.utilisateur_id
    });

    return res.status(201).json(commande);
  } catch (err) {
    console.error('Erreur lors de la création de la commande:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};




/**
 * POST /api/commandes/:id/lignes
 * 🔹 Ajouter une ligne de commande
 */
exports.addLigneCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { article_id, quantite } = req.body;

    const commande = await Commande.findByPk(id);
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });

    const article = await Article.findByPk(article_id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    const prix_unitaire = parseFloat(article.prix);
    const sous_total = quantite * prix_unitaire;
    const tauxTVA = Number(process.env.TVA_TAUX) || 0.2;



    const ligne = await LigneCommande.create({
      commande_id: id,
      article_id,
      quantite,
      total: sous_total,
      total_ttc : sous_total * (1+Number(process.env.TVA_TAUX))

    });

    recalculerTotauxCommande(id);

    
    return res.status(201).json({ message: 'Ligne de commande ajoutée', ligne });
  } catch (err) {
    console.error('Erreur lors de l’ajout de la ligne de commande:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * DELETE /api/commandes/:id/lignes/:ligneId
 * 🔹 Supprimer une ligne de commande
 */
exports.deleteLigneCommande = async (req, res) => {
  try {
    const { id, ligneId } = req.params;

    const commande = await Commande.findByPk(id);
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });

    const ligne = await LigneCommande.findByPk(ligneId);
    if (!ligne) return res.status(404).json({ message: 'Ligne de commande non trouvée' });

    await ligne.destroy();

    recalculerTotauxCommande(id);

    return res.status(200).json({ message: 'Ligne de commande supprimée avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la ligne de commande:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};


/**
 * GET /api/commandes
 * 🔹 Liste complète des commandes
 */
exports.getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      include: [
        { model: Client, as: 'client_de_la_commande' },
        { model: Utilisateur, as: 'createur_commande' },
        { model: LigneCommande, as: 'lignes_de_la_commande', include: [{ model: Article, as: 'article_de_la_ligne' }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(commandes);
  } catch (err) {
    console.error('Erreur lors de la récupération des commandes:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};


/**
 * GET /api/commandes/:id
 * 🔹 Détails d'une commande
 */
exports.getCommandeById = async (req, res) => {
  try {
    const { id } = req.params;

    const commande = await Commande.findByPk(id, {
      include: [
        { model: Client, as: 'client_de_la_commande' },
        { model: LigneCommande, as: 'lignes_de_la_commande', include: [{ model: Article, as: 'article_de_la_ligne' }] }
      ]
    });

    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });

    return res.status(200).json(commande);
  } catch (err) {
    console.error('Erreur lors de la récupération de la commande:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};


/**
 * PUT /api/commandes/:id
 * 🔹 Modifier une commande
 */
exports.editCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut,client_id, origine } = req.body;

    const commande = await Commande.findByPk(id);
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });

    await commande.update({
      statut: statut ?? commande.statut,
      client_id: client_id ?? commande.client_id,
      origine: origine ?? commande.origine

    });

    return res.status(200).json({
      message: 'Commande mise à jour avec succès',
      commande
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la commande:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};



/**
 * PUT /api/commandes/:id/a-preparer
 * 🔹 Valider une commande (passer de BROUILLON à A_PREPARER)
 */
exports.declarerCommandeAPreparer = async (req, res) => {
  try {
    const { id } = req.params;
    const commande = await Commande.findByPk(id);
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });

    if (commande.statut !== 'BROUILLON')
      return res.status(400).json({ message: 'La commande ne peut pas être validée' });

    await commande.update({ statut: 'A_PREPARER' });
    return res.status(200).json({ message: 'Commande validée (A preparer) avec succès', commande });
  } catch (err) {
    console.error('Erreur lors de la validation:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * GET /api/commandes/liste/status-a-preparer
 * Liste des commandes à préparer (VALIDÉES uniquement)
 */
exports.getCommandesApreparer = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      where: { statut: 'A_PREPARER' },
      include: [{ model: Client, as: 'client_de_la_commande' }],
      order: [['createdAt', 'ASC']]
    });
    return res.status(200).json(commandes);
  } catch (err) {
    console.error('Erreur lors de la récupération des commandes à préparer:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};


/**
 * PUT /api/commandes/:id/preparer
 * Déclarer une commande préparée
 */
exports.declarerCommandePreparee = async (req, res) => {
  try {

    const utilisateurAuth = req.utilisateur;
    if (!utilisateurAuth || !utilisateurAuth.utilisateur_id)
    {
      return res.status(401).json({ message: 'Utilisateur non authentifié (token invalide)' });
    }


    const { id } = req.params;
    const commande = await Commande.findByPk(id);
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });

    if (commande.statut !== 'A_PREPARER')
      return res.status(400).json({ message: 'La commande doit être validée avant d’être préparée' });

    await commande.update({ statut: 'PREPAREE' ,
          "commande_preparateur_id" : utilisateurAuth.utilisateur_id,
        "tstamp_commande_preparee" : new Date() });

    return res.status(200).json({ message: 'Commande marquée comme préparée', commande });
  } catch (err) {
    console.error('Erreur lors de la préparation:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};

/**
 * PUT /api/commandes/:id/livrer
 * Déclarer une commande livrée
 */
exports.declarerCommandeLivree = async (req, res) => {
  try {

    const utilisateurAuth = req.utilisateur;
    if (!utilisateurAuth || !utilisateurAuth.utilisateur_id)
    {
      return res.status(401).json({ message: 'Utilisateur non authentifié (token invalide)' });
    }

    const { id } = req.params;
    const commande = await Commande.findByPk(id);
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });

    if (commande.statut !== 'PREPAREE')
      return res.status(400).json({ message: 'La commande doit être préparée avant d’être livrée' });

    await commande.update({ statut: 'LIVREE' ,
          "commande_livreur_id" : utilisateurAuth.utilisateur_id,
        "tstamp_commande_livree" : new Date() });


          return res.status(200).json({ message: 'Commande livrée avec succès', commande });
  } catch (err) {
    console.error('Erreur lors de la livraison:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};


/**
 * DELETE /api/commandes/:id
 * Supprimer une commande
 */
exports.deleteCommande = async (req, res) => {
  const transaction = await Commande.sequelize.transaction();

  try {
    const { id } = req.params;

    // Vérifie que la commande existe
    const commande = await Commande.findByPk(id, { transaction });
    if (!commande) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Supprime d'abord les lignes de commande associées
    await LigneCommande.destroy({
      where: { commande_id: id },
      transaction
    });

    // Puis supprime la commande elle-même
    await commande.destroy({ transaction });

    await transaction.commit();
    return res.status(200).json({ message: 'Commande supprimée avec succès' });

  } catch (err) {
    await transaction.rollback();
    console.error('Erreur lors de la suppression de la commande:', err);
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
};



async function recalculerTotauxCommande(commande_id) {
  const commande = await Commande.findByPk(commande_id, {
    include: [{ model: LigneCommande, as: 'lignes_de_la_commande' }]
  });

  if (!commande) return null;

  const tauxTVA = Number(process.env.TVA_TAUX);

  let totalHT = 0;
  for (const ligne of commande.lignes_de_la_commande) {
    const montantLigne = parseFloat(ligne.total);
    totalHT += montantLigne;
  }

  const totalTTC = totalHT * (1 + tauxTVA);

  await commande.update({
    prix_total: totalHT,
    prix_total_ttc: totalTTC
  });

  return commande;
}
