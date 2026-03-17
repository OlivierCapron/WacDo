const express = require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/multer');

const { getOptions, createOption, editOption, deleteOption } = require('../controllers/options.controller');
const router = express.Router();



/**
 *  @swagger
 *  tag :
 *      name : Option des menus
 *      description : Gestion des options liés aux menus
 */


/**
 * @swagger
 * /api/options:
 *   get:
 *     summary: Liste de toutes les options
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des options récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Option'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', auth, getOptions);

/**
 * @swagger
 * /api/options:
 *   post:
 *     summary: Créer une nouvelle option
 *     tags: [Options]
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
 *               - prix
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Boisson
 *               prix:
 *                 type: number
 *                 format: float
 *                 example: 2.5
 *     responses:
 *       201:
 *         description: Option créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 */
router.post('/', auth, authorizeRoles('ADMINISTRATION'), createOption);

/**
 * @swagger
 * /api/options/{id}:
 *   put:
 *     summary: Modifier une option existante
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Option'
 *     responses:
 *       200:
 *         description: Option mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Option non trouvée
 */

router.put('/:id', auth, authorizeRoles('ADMINISTRATION'), editOption);

/**
 * @swagger
 * /api/options/{id}:
 *   delete:
 *     summary: Supprimer une option
 *     tags: [Options]
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
 *         description: Option supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Option supprimée"
 *       404:
 *         description: Option non trouvée
 */
router.delete('/:id', auth, authorizeRoles('ADMINISTRATION'), deleteOption);


module.exports = router; 