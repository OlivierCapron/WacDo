const express= require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/multer');

const {getCommandes,getCommandeById,createCommande,editCommande,deleteCommande,
    declarerCommandeAPreparer,declarerCommandePreparee,declarerCommandeLivree,getCommandesApreparer,
    addLigneCommande,deleteLigneCommande
} = require('../controllers/commandes.controller');

const router = express.Router();





/**
 *  @swagger
 *  tag :
 *     name : Commandes
 *     description : Gestion des commandes
 */



/**
 * @swagger
 * /api/commandes:
 *   get:
 *     summary: Liste complète des commandes
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée 
 *
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - origine
 *             properties:
 *               client_id:
 *                 type: integer
 *               origine:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée
 */
router.get('/', auth, getCommandes);


/**
 * @swagger
 * /api/commandes/{id}:
 *   get:
 *     summary: details d une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la commande 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commande'  
 */
router.get('/:id', auth,authorizeRoles( 'ACCUEIL','ADMINISTRATION'), getCommandeById);



/**
 * @swagger
 * /api/commandes:
 *   post:
 *     summary: Créer une  commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - origine
 *             properties:
 *               client_id:
 *                 type: integer
 *                 example: 1
 *               origine:
 *                 type: string
 *                 example: 'TELEPHONE'
 *     responses:
 *       201:
 *         description: Commande créée 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commande' 
 */
router.post('/', auth,authorizeRoles('ACCUEIL','ADMINISTRATION'), createCommande);



/**
 * @swagger
 * /api/commandes/{id}:
 *   put:
 *     summary: Modifier une commande 
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 example: "A_PREPARER"
 *               client_id:
 *                 type: integer
 *                 example: 2
 *               origine:
 *                 type: string
 *                 example: "COMPTOIR"
 *     responses:
 *       200:
 *         description: Commande mise à jour
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commande'
 *
 */
router.put('/:id', auth,authorizeRoles('ACCUEIL','ADMINISTRATION'), editCommande);



/**
 * @swagger
 * /api/commandes/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande supprimée 
 */

router.delete('/:id', auth,authorizeRoles('ACCUEIL','ADMINISTRATION'), deleteCommande);



/**
 * @swagger
 * /api/commandes/{id}/lignes:
 *   post:
 *     summary: Ajouter une ligne à une commande
 *     tags: [Lignes de commande]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - article_id
 *               - quantite
 *             properties:
 *               article_id:
 *                 type: integer
 *               quantite:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ligne de commande ajoutée
 */

router.post('/:id/lignes', auth,authorizeRoles('ACCUEIL','ADMINISTRATION'), addLigneCommande);

/**
 * @swagger
 * /api/commandes/{id}/lignes/{ligneId}:
 *   delete:
 *     summary: Supprimer une ligne de commande
 *     tags: [Lignes de commande]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: ligneId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ligne supprimée avec succès
 */
router.delete('/:id/lignes/:ligneId', auth,authorizeRoles('ACCUEIL','ADMINISTRATION'), deleteLigneCommande);



/**
 * @swagger
 * /api/commandes/{id}/a-preparer:
 *   put:
 *     summary: Passer une commande à l'état "A_PREPARER"
 *     tags: [Statuts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande passée à A_PREPARER
 */
router.put('/:id/a-preparer', auth,authorizeRoles('ACCUEIL','ADMINISTRATION'), declarerCommandeAPreparer);

/**
 * @swagger
 * /api/commandes/liste/status-a-preparer:
 *   get:
 *     summary: Liste des commandes à préparer
 *     tags: [Statuts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes à préparer
 */

  router.get('/liste/status-a-preparer', auth,authorizeRoles('PREPARATION','ADMINISTRATION'), getCommandesApreparer);

/**
 * @swagger
 * /api/commandes/{id}/preparee:
 *   put:
 *     summary: Marquer une commande comme préparée
 *     tags: [Statuts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande marquée comme préparée
 */
router.put('/:id/preparee', auth,authorizeRoles('PREPARATION','ADMINISTRATION'), declarerCommandePreparee);


/**
 * @swagger
 * /api/commandes/{id}/livree:
 *   put:
 *     summary: Marquer une commande comme livrée
 *     tags: [Statuts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande livrée avec succès
 */
router.put('/:id/livree', auth,authorizeRoles('ACCUEIL','ADMINISTRATION'), declarerCommandeLivree);


 module.exports=router; 