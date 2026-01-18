/**
 * @swagger
 * components:
 *   schemas:
 *     Categorie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: "Burgers"
 * -----------------------------------------------
 *     Produit:
 *       type: object
 *       properties:
 *         produit_id:
 *           type: integer
 *           example: 5
 *         nom:
 *           type: string
 *           example: "Big Wac"
 *         description:
 *           type: string
 *           example: "Burger emblématique avec deux steaks"
 *         prix:
 *           type: number
 *           example: 8.5
 *         categorie_id:
 *           type: integer
 *           example: 1
 *         categorie:
 *           $ref: '#/components/schemas/Categorie'
 * -----------------------------------------------
 *     Client:
 *       type: object
 *       properties:
 *         client_id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: "Dupont"
 * -----------------------------------------------
 *     Utilisateur:
 *       type: object
 *       properties:
 *         utilisateur_id:
 *           type: integer
 *           example: 2
 *         identifiant:
 *           type: string
 *           example: "admin"
 *         role:
 *           type: string
 *           example: "ADMINISTRATION"
 * -----------------------------------------------
 *     LigneCommande:
 *       type: object
 *       required:
 *         - commande_id
 *         - produit_id
 *         - quantite
 *       properties:
 *         ligne_commande_id:
 *           type: integer
 *           example: 10
 *         commande_id:
 *           type: integer
 *           example: 1
 *         produit_id:
 *           type: integer
 *           example: 5
 *         quantite:
 *           type: integer
 *           example: 2
 *         total:
 *           type: number
 *           example: 10.0
 *         total_ttc:
 *           type: number
 *           example: 12.0
 *         produit_de_la_ligne:
 *           $ref: '#/components/schemas/Produit'
 * -----------------------------------------------
 *     Commande:
 *       type: object
 *       required:
 *         - client_id
 *         - statut
 *       properties:
 *         commande_id:
 *           type: integer
 *           example: 1
 *         client_id:
 *           type: integer
 *           example: 3
 *         commande_createur_id:
 *           type: integer
 *           example: 5
 *         tstamp_commande_cree:
 *           type: string
 *           format: date-time
 *           example: "2026-01-11T09:30:00.000Z"
 *         tstamp_commande_preparee:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         tstamp_commande_livree:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         statut:
 *           type: string
 *           enum: [BROUILLON, A_PREPARER, PREPAREE, LIVREE]
 *           example: "A_PREPARER"
 *         origine:
 *           type: string
 *           example: "COMPTOIR"
 *         prix_total:
 *           type: number
 *           example: 25.9
 *         prix_total_ttc:
 *           type: number
 *           example: 31.08
 *         client:
 *           $ref: '#/components/schemas/Client'
 *         createur_commande:
 *           $ref: '#/components/schemas/Utilisateur'
 *         lignes_de_la_commande:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LigneCommande'
 * 
 * -----------------------------------------------
 * 
 *     Article:
 *       type: object
 *       properties:
 *         article_id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: "Big Wac"
 *         description:
 *           type: string
 *           example: "Burger double steak avec fromage"
 *         prix:
 *           type: number
 *           example: 8.5
 *         categorie_id:
 *           type: integer
 *           example: 2
 *         categorie:
 *           $ref: '#/components/schemas/Categorie'
 * -----------------------------------------------
 *     Option:
 *       type: object
 *       properties:
 *         option_id:
 *           type: integer
 *           example: 4
 *         nom:
 *           type: string
 *           example: "Boisson au choix"
 *         prix_supplementaire:
 *           type: number
 *           example: 1.5
 * -----------------------------------------------
 *     Menu:
 *       type: object
 *       description: "Un menu est un article composé de plusieurs produits et d'options"
 *       properties:
 *         article_id:
 *           type: integer
 *           description: Identifiant de l'article associé au menu
 *           example: 1
 *         nom:
 *           type: string
 *           example: "Menu Maxi Wac"
 *         description:
 *           type: string
 *           example: "Menu avec burger, frites et boisson"
 *         prix:
 *           type: number
 *           example: 12.99
 *         produits:
 *           type: array
 *           description: Liste des produits inclus dans le menu
 *           items:
 *             $ref: '#/components/schemas/Article'
 *         options:
 *           type: array
 *           description: Liste des options disponibles pour le menu
 *           items:
 *             $ref: '#/components/schemas/Option'
 */
