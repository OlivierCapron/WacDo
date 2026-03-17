const express= require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/multer');

const { getUtilisateurs,getUtilisateurDetails,createUtilisateur,editUtilisateur,deleteUtilisateur,getRoles,loginUtilisateur } = require('../controllers/utilisateurs.controller');
const router = express.Router();



/**
 *  @swagger
 *  tag :
 *      name : Utilisateurs
 *      description : Gestion des utilisateurs
 */


/**
 * @swagger
 * /api/utilisateurs:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 * 
 */
router.get('/',auth,getUtilisateurs);

/**
 * @swagger
 * /api/utilisateurs/roles:
 *   get:
 *     summary: Récupérer la liste des rôles disponibles
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["ADMINISTRATION", "PREPARATION", "ACCUEIL"]
 */
router.get('/roles',auth,authorizeRoles('ADMINISTRATION'),  getRoles);


/**
 * @swagger
 * /api/utilisateurs/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par ID
 *     tags: [Utilisateurs]
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
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id',auth,  getUtilisateurDetails);


/**
 * @swagger
 * /api/utilisateurs:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifiant
 *               - motDePasse
 *               - role
 *             properties:
 *               identifiant:
 *                 type: string
 *                 example: admin@wacdo.fr
 *               motDePasse:
 *                 type: string
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 example: ADMINISTRATION
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 utilisateur_id:
 *                   type: integer
 *                   example: 1
 *                 identifiant:
 *                   type: string
 *                   example: admin@wacdo.fr
 *                 role:
 *                   type: string
 *                   example: ADMINISTRATION
 */
router.post('/',auth,authorizeRoles('ADMINISTRATION'),createUtilisateur);




/**
 * @swagger
 * /api/utilisateurs/{id}:
 *
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Utilisateurs]
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
 *             $ref: '#/components/schemas/Utilisateur'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 *
 */
router.put('/:id',auth,authorizeRoles('ADMINISTRATION'),  editUtilisateur);

/**
 * @swagger
 * /api/utilisateurs/{id}:
 *
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
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
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé"
 *       404:
 *         description: Utilisateur non trouvé
 * 
 */
router.delete('/:id',auth,authorizeRoles('ADMINISTRATION'),  deleteUtilisateur);


 
/**
 * @swagger
 * /api/utilisateurs/auth/login:
 *   post:
 *     summary: Connexion d’un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifiant
 *               - motDePasse
 *             properties:
 *               identifiant:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 utilisateur:
 *                   $ref: '#/components/schemas/Utilisateur'
 *       400:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/auth/login',loginUtilisateur);

 module.exports=router; 