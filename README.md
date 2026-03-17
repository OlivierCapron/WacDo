# WacDo

Projet WacDo (Node.js)

## Installation

```bash
npm install
```

## Configuration

Créer et renseigner les fichiers d’environnement :

- `.env` pour le mode normal
- `.env.test` pour le mode test

## Lancement du projet

```bash
node app.js
```

## Lancement du projet en mode test

Utilise la configuration définie dans `.env.test`.

```bash
NODE_ENV=test node app.js
```

## Création du premier user admin

```bash
NODE_ENV=test node scripts/init_admin.js
```

## Build

Aucune étape de build nécessaire pour ce projet.  
L’application s’exécute directement avec Node.js.

## Lancement avec PM2

### Installation

```bash
npm install -g pm2
```

### Usage serveur / production

```bash
pm2 start app.js --name wacdo
```

### Lancement standard

```bash
npm start
```

## Documentation Swagger

```text
https://nodejs.fleyetrap.com/api-docs/
```

## Lancement des tests

```bash
npm test
```

## Couverture de tests

```bash
npm run test:coverage
```


# Endpoints disponibles

## Endpoints API

### Catégories

- `GET /api/categories` : Lister toutes les catégories
- `POST /api/categories` : Créer une nouvelle catégorie
- `PUT /api/categories/{id}` : Modifier une catégorie
- `DELETE /api/categories/{id}` : Supprimer une catégorie

### Clients

- `GET /api/clients` : Lister tous les clients
- `POST /api/clients` : Créer un client (`ACCUEIL` ou `ADMINISTRATION`)
- `GET /api/clients/{id}` : Récupérer un client par ID
- `PUT /api/clients/{id}` : Modifier un client (`ACCUEIL` ou `ADMINISTRATION`)
- `DELETE /api/clients/{id}` : Supprimer un client (`ACCUEIL` ou `ADMINISTRATION`)

### Commandes

- `GET /api/commandes` : Liste complète des commandes
- `POST /api/commandes` : Créer une commande
- `GET /api/commandes/{id}` : Détail d’une commande
- `PUT /api/commandes/{id}` : Modifier une commande
- `DELETE /api/commandes/{id}` : Supprimer une commande

### Lignes de commande

- `POST /api/commandes/{id}/lignes` : Ajouter une ligne à une commande
- `DELETE /api/commandes/{id}/lignes/{ligneId}` : Supprimer une ligne de commande

### Statuts de commande

- `PUT /api/commandes/{id}/a-preparer` : Passer une commande à l’état `A_PREPARER`
- `GET /api/commandes/a-preparer` : Liste des commandes à préparer
- `PUT /api/commandes/{id}/preparee` : Marquer une commande comme préparée
- `PUT /api/commandes/{id}/livree` : Marquer une commande comme livrée

### Menus

- `GET /api/menus` : Récupérer la liste de tous les menus
- `POST /api/menus` : Créer un nouveau menu
- `GET /api/menus/{id}` : Obtenir le détail d’un menu
- `PUT /api/menus/{id}` : Modifier un menu existant
- `DELETE /api/menus/{id}` : Supprimer un menu
- `POST /api/menus/{id}/produits` : Ajouter un produit à un menu
- `DELETE /api/menus/{id}/produits/{produitId}` : Supprimer un produit d’un menu
- `POST /api/menus/{id}/options` : Ajouter une option à un menu
- `DELETE /api/menus/{id}/options/{optionId}` : Supprimer une option d’un menu

### Options

- `GET /api/options` : Liste de toutes les options
- `POST /api/options` : Créer une nouvelle option
- `PUT /api/options/{id}` : Modifier une option existante
- `DELETE /api/options/{id}` : Supprimer une option

### Produits

- `GET /api/produits` : Récupérer la liste de tous les produits
- `POST /api/produits` : Créer un nouveau produit
- `GET /api/produits/{id}` : Récupérer un produit par son ID
- `PUT /api/produits/{id}` : Modifier un produit
- `DELETE /api/produits/{id}` : Supprimer un produit

### Utilisateurs

- `GET /api/utilisateurs` : Récupérer la liste de tous les utilisateurs
- `POST /api/utilisateurs` : Créer un nouvel utilisateur
- `GET /api/utilisateurs/{id}` : Obtenir un utilisateur par ID
- `PUT /api/utilisateurs/{id}` : Modifier un utilisateur
- `DELETE /api/utilisateurs/{id}` : Supprimer un utilisateur
- `GET /api/utilisateurs/roles` : Récupérer la liste des rôles disponibles
- `POST /api/utilisateurs/auth/login` : Connexion d’un utilisateur