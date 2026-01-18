// belongsTo     -> relation 1-1
// hasMany       -> relation 1-N
// belongsToMany -> relation N-N


// //   User author <-> Project : un projet a un seul auteur : un auteur a plusieurs projets
// Project.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
// User.hasMany(Project, { as: 'projects', foreignKey: 'authorId' });

// //   Project (likes)  <-> Users / u projets a plusieurs likes d'user et un user like plusieurs porjets
// Project.belongsToMany(User, { through: 'ProjectLikes', as: 'likes' });
// User.belongsToMany(Project, { through: 'ProjectLikes', as: 'likedProjects' });





const Categorie         =   require('./categorie.model');
const Utilisateur       =   require('./utilisateur.model');
const Client            =   require('./client.model');
const Article           =   require('./article.model');
const Produit           =   require('./produit.model');
const Option            =   require('./option.model');
const Menu              =   require('./menu.model');
const Commande          =   require('./commande.model');
const LigneCommande     =   require('./lignes_commandes.model');
const MenuProduit       =   require('./menu_produits.model');
const MenuOption        =   require('./menu_options.model');

//////////////////////////////
// Lien Produit <-> Article // 
//////////////////////////////


////////////////////////////////
// Lien Produit <-> Categorie //    OK
////////////////////////////////

// Un produit possede forcement une Categorie (Relation 1-1)
Produit.belongsTo(Categorie, {  as: 'categorie', foreignKey: 'categorie_id' });
// Une categorie pour concernenrplusieurs produits (Relation 1-N)
Categorie.hasMany(Produit, { as: 'produits',  foreignKey: 'categorie_id' });





///////////////////////////////
// --  Lien Menu <-> Article //
///////////////////////////////


///////////////////////////////
// --  Lien Menu <-> Produit //
///////////////////////////////

// Table d'association Menu -> PRoduit + gestion de quantité (relation N-N)
Menu.belongsToMany(Produit, { as: 'produits_du_menu' , through: MenuProduit, foreignKey: 'menu_id',  otherKey: 'produit_id'  });
// Table d'association PRoduit -> Menu + gestion de quantité (relation N-N)
Produit.belongsToMany(Menu, {  as: 'menus_dun_produit', through: MenuProduit, foreignKey: 'produit_id', otherKey: 'menu_id'});




///////////////////////////////
// --  Lien Menu <-> Option //
///////////////////////////////

// Table d'association Menu -> Option + gestion de quantité (relation N-N)
Menu.belongsToMany(Option, { as: 'options_dun_menu' , through: MenuOption, foreignKey: 'menu_id',  otherKey: 'option_id'  });

// Table d'association Option -> Menu + gestion de quantité (relation N-N)
Option.belongsToMany(Menu, {  as: 'menus_dune_option', through: MenuOption, foreignKey: 'option_id', otherKey: 'menu_id'});


////////////////////////////////////////
// --  Lien Article / Produit / Menu  //
////////////////////////////////////////

Article.hasOne(Menu, { foreignKey: 'article_id', as: 'menu' });
Menu.belongsTo(Article, { foreignKey: 'article_id', as: 'article_menu' });

Article.hasOne(Produit, { foreignKey: 'article_id', as: 'produit' });
Produit.belongsTo(Article, { foreignKey: 'article_id', as: 'article_produit' });


/////////////////////////////////////////////////
// --  Lien Commande <-> Utilisateurs et client //
/////////////////////////////////////////////////


Commande.belongsTo(Client, { as: 'client_de_la_commande', foreignKey: 'client_id'});
Client.hasMany(Commande, {  as: 'commandes_du_client', foreignKey: 'client_id' });

Commande.belongsTo(Utilisateur, { as: 'createur_commande',foreignKey: 'commande_createur_id'});
Utilisateur.hasMany(Commande, {  as: 'commandes_creees', foreignKey: 'commande_createur_id' });

Commande.belongsTo(Utilisateur, { as: 'preparateur_commande', foreignKey: 'commande_preparateur_id'});
Utilisateur.hasMany(Commande, {as: 'commandes_preparees',  foreignKey: 'commande_preparateur_id'  });

Commande.belongsTo(Utilisateur, {as: 'livreur_commande', foreignKey: 'commande_livreur_id'});
Utilisateur.hasMany(Commande, { as: 'commandes_livrees', foreignKey: 'commande_livreur_id' });



///////////////////////////////
// --  Lien Commande <-> Article //
///////////////////////////////

LigneCommande.belongsTo(Commande, {as: 'commande_de_la_ligne', foreignKey: 'commande_id'});
// Commande.hasMany(LigneCommande, { as: 'lignes_de_la_commande', foreignKey: 'commande_id' });
Commande.hasMany(LigneCommande, {  as: 'lignes_de_la_commande',  foreignKey: 'commande_id'});

LigneCommande.belongsTo(Article, {as: 'article_de_la_ligne', foreignKey: 'article_id'});
//Commande.hasMany(LigneCommande, { as: 'articles' , foreignKey: 'article_id'});



module.exports = { Categorie, Utilisateur,Client,Article,Produit,Menu,Option,Commande,LigneCommande,MenuProduit,MenuOption};






//const Project = require('./project.model');
//const Comment = require('./comment.model');

//   User author <-> Project
//Project.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
//User.hasMany(Project, { as: 'projects', foreignKey: 'authorId' });

//   Project (likes)  <-> Users
//Project.belongsToMany(User, { through: 'ProjectLikes', as: 'likes' });
//User.belongsToMany(Project, { through: 'ProjectLikes', as: 'likedProjects' });

// Project <-> Commentaires
//Project.hasMany(Comment, { as: 'comments', foreignKey: 'projectId' });
//Comment.belongsTo(Project, { as: 'project', foreignKey: 'projectId' });

//  Commentaires d'un utilisateur
//User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' });
//Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

