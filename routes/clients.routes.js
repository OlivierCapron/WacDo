const express= require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/multer');

const {getClients,getClientById,createClient,editClient,deleteClient} = require('../controllers/clients.controller');
const router = express.Router();



/**
 *  @swagger
 *  tag :
 *      name : Clients
 *      description : Gestion des clients
 */


/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Lister tous les clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', auth, getClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Récupérer un client par ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', auth, getClientById);


/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Crée un client (ACCUEIL ou ADMINISTRATION)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Le nom du client est obligatoire
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit 
 *       500:
 *         description: Erreur serveur
 */
router.post('/', auth, authorizeRoles('ACCUEIL','ADMINISTRATION'), createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Modifier un client (ACCUEIL ou ADMINISTRATION)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.put('/:id', auth, authorizeRoles('ACCUEIL','ADMINISTRATION'),editClient);


/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Supprimer un client (ACCUEIL ou ADMINISTRATION)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Client supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Client supprimé avec succès"
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', auth, authorizeRoles('ACCUEIL','ADMINISTRATION'), deleteClient);




 module.exports=router; 