const express= require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/multer');

const {getProduits,getProduitDetails,createProduit,editProduit, deleteProduit} = require('../controllers/produits.controller');
const router = express.Router();



/**
 *  @swagger
 *  tag :
 *      name : Produits
 *      description : Gestion des produits
 */


/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Produits]
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
 *               - categorie_id
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Big Mac
 *               description:
 *                 type: string
 *                 example: Burger avec steak et fromage
 *               prix:
 *                 type: number
 *                 format: float
 *                 example: 8.5
 *               categorie_id:
 *                 type: integer
 *                 example: 1
 *               disponible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produit_id:
 *                   type: integer
 *                   example: 12
 *                 nom:
 *                   type: string
 *                   example: Big Mac
 *                 description:
 *                   type: string
 *                   example: Burger avec steak et fromage
 *                 prix:
 *                   type: number
 *                   format: float
 *                   example: 8.5
 *                 disponible:
 *                   type: boolean
 *                   example: true
 *                 categorie_id:
 *                   type: integer
 *                   example: 1
 */router.get('/',auth,getProduits);


/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     tags: [Produits]
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
 *         description: Produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Produit non trouvé *
 */
router.get('/:id',auth,  getProduitDetails);


/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produit'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/',auth,authorizeRoles('ADMINISTRATION'),createProduit);


/**
 * @swagger
 * /api/produits/{id}:
 *   put:
 *     summary: Modifier un produit
 *     tags: [Produits]
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
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Big Mac Deluxe
 *               description:
 *                 type: string
 *                 example: Burger encore plus savoureux avec bacon
 *               prix:
 *                 type: number
 *                 format: float
 *                 example: 9.5
 *               categorie:
 *                 type: integer
 *                 example: 2
 *               disponible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produit mis à jour avec succès
 *                 produit:
 *                   type: object
 *                   properties:
 *                     produit_id:
 *                       type: integer
 *                     nom:
 *                       type: string
 *                     description:
 *                       type: string
 *                     prix:
 *                       type: number
 *                       format: float
 *                     disponible:
 *                       type: boolean
 *                     categorie_id:
 *                       type: integer
 *                     categorie_nom:
 *                       type: string
 */
router.put('/:id',auth, authorizeRoles('ADMINISTRATION'), editProduit);


/**
 * @swagger
 * /api/produits/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Produits]
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
 *         description: Produit supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit supprimé"
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/:id',auth,authorizeRoles('ADMINISTRATION'),  deleteProduit);


 module.exports=router; 