const express= require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/multer');

const {getCategories,createCategorie,editCategorie,deleteCategorie} = require('../controllers/categories.controller');
const router = express.Router();



/**
 *  @swagger
 *  tag :
 *      name : Categories
 *      description : Gestion des categories (liées aux produits)
 */


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lister toutes les catégories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categorie'
 *       401:
 *        description : Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/',auth,getCategories);


/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     tags: [Categories]
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
 *                 example: "Sides"
 *     responses:
 *       201:
 *         description: Catégorie créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       500:
 *         description: Erreur serveur
 */
router.post('/',auth,authorizeRoles('ADMINISTRATION'),createCategorie);


/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Modifier une catégorie
 *     tags: [Categories]
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
 *                 example: "Burgers"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       401:
 *         description: Authentification non valide
 *       403:
 *         description: Acces interdit
 *       404:
 *         description: Catégorie introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id',auth,authorizeRoles('ADMINISTRATION'),  editCategorie);


/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Categories]
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
 *         description: Catégorie supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Catégorie supprimée"
 *       401:
 *         description: Authentification non valide
 *       403:
 *         description: Acces interdit
 *       404:
 *         description: Catégorie introuvable
 *       500:
 *         description: Erreur serveur
*/
router.delete('/:id',auth,authorizeRoles('ADMINISTRATION'),  deleteCategorie);


 module.exports=router; 