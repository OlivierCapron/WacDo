    const express= require('express');
    const auth = require('../middleware/auth');
    const authorizeRoles = require('../middleware/authorizeRoles');
    const upload = require('../middleware/multer');

    const {getMenus,getMenuDetails,createMenu,editMenu,deleteMenu,addProduitToMenu,removeProduitFromMenu,addOptionToMenu,removeOptionFromMenu} = require('../controllers/menus.controller');
    const router = express.Router();



    /**
     *  @swagger
     *  tag :
     *      name : Menus
     *      description : Gestion des utilisateurs
     */



    /**
     * @swagger
     * /api/menus:
     *   get:
     *     summary: Récupérer la liste de tous les menus
     *     tags: [Menus]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des menus récupérée avec succès
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Menu'
     *
     */
    router.get('/',auth,getMenus);


    /**
     * @swagger
     * /api/menus/{id}:
     *   get:
     *     summary: Obtenir le détail d’un menu
     *     tags: [Menus]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID du menu
     *     responses:
     *       200:
     *         description: Détails du menu récupérés
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       404:
     *         description: Menu non trouvé
     */
    router.get('/:id',auth,  getMenuDetails);


    /**
     * @swagger
     * /api/menus:
     *   post:
     *     summary: Créer un nouveau menu
     *     tags: [Menus]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/MenuInput'
     *     responses:
     *       201:
     *         description: Menu créé avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       400:
     *         description: Erreur de validation
     */
    router.post('/',auth,authorizeRoles('ADMINISTRATION'),createMenu);


    /**
     * @swagger
     * /api/menus/{id}:
     *
     *   put:
     *     summary: Modifier un menu existant
     *     tags: [Menus]
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
     *             $ref: '#/components/schemas/MenuInput'
     *     responses:
     *       200:
     *         description: Menu mis à jour avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       404:
     *         description: Menu non trouvé
     *
     */
    router.put('/:id',auth,authorizeRoles('ADMINISTRATION'),  editMenu);


    /**
     * @swagger
     * /api/menus/{id}:
     *   delete:
     *     summary: Supprimer un menu
     *     tags: [Menus]
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
     *         description: Menu supprimé avec succès
     *       404:
     *         description: Menu non trouvé
     */
    router.delete('/:id',auth,authorizeRoles('ADMINISTRATION'),  deleteMenu);


    /**
     * @swagger
     * /api/menus/{id}/produits:
     *   post:
     *     summary: Ajouter un produit à un menu
     *     tags: [Menus]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID du menu
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - produit_id
     *             properties:
     *               produit_id:
     *                 type: integer
     *                 example: 3
     *     responses:
     *       201:
     *         description: Produit ajouté au menu
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       404:
     *         description: Menu ou produit introuvable
     */
    router.post('/:id/produits',auth,authorizeRoles('ADMINISTRATION'),addProduitToMenu);

    /**
     * @swagger
     * /api/menus/{id}/produits/{produitId}:
     *   delete:
     *     summary: Supprimer un produit d’un menu
     *     tags: [Menus]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *       - name: produitId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Produit supprimé du menu avec succès
     *       404:
     *         description: Menu ou produit non trouvé
     */
    router.delete('/:id/produits/:produitId',auth, authorizeRoles('ADMINISTRATION'), removeProduitFromMenu);




    // Les options des menus
    /**
     * @swagger
     * /api/menus/{id}/options:
     *   post:
     *     summary: Ajouter une option à un menu
     *     tags: [Menus]
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
     *               - option_id
     *             properties:
     *               option_id:
     *                 type: integer
     *                 example: 2
     *     responses:
     *       201:
     *         description: Option ajoutée au menu
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       404:
     *         description: Menu ou option non trouvée
     */
    router.post('/:id/options',auth,authorizeRoles('ADMINISTRATION'),addOptionToMenu);

    /**
     * @swagger
     * /api/menus/{id}/options/{optionId}:
     *   delete:
     *     summary: Supprimer une option d’un menu
     *     tags: [Menus]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *       - name: optionId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Option supprimée du menu avec succès
     *       404:
     *         description: Menu ou option non trouvée
     */
    router.delete('/:id/options/:optionId',auth,authorizeRoles('ADMINISTRATION'),  removeOptionFromMenu);







    module.exports=router; 