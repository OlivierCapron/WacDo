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

// // Un produit est un Article par nature (Relation 1-1)
//Produit.belongsTo(Article, { as: 'article', foreignKey: 'article_id'  });

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

// Un menu est un Article par nature  (Relation 1-1)
//Menu.belongsTo(Article, {  as: 'article', foreignKey:   'menu_id' });

///////////////////////////////
// --  Lien Menu <-> Produit //
///////////////////////////////

// Table d'association Menu -> PRoduit + gestion de quantité (relation N-N)
Menu.belongsToMany(Produit, { as: 'produits_du_menu' , through: MenuProduit, foreignKey: 'id_menu',  otherKey: 'id_produit'  });
// Table d'association PRoduit -> Menu + gestion de quantité (relation N-N)
Produit.belongsToMany(Menu, {  as: 'menus_dun_produit', through: MenuProduit, foreignKey: 'id_produit', otherKey: 'id_menu'});




///////////////////////////////
// --  Lien Menu <-> Option //
///////////////////////////////

// Table d'association Menu -> Option + gestion de quantité (relation N-N)
Menu.belongsToMany(Option, { as: 'options_dun_menu' , through: MenuOption, foreignKey: 'id_menu',  otherKey: 'id_option'  });
//Menu.belongsToMany(Option, { as: 'options_dun_menu' , through: MenuOption });

// Table d'association Option -> Menu + gestion de quantité (relation N-N)
Option.belongsToMany(Menu, {  as: 'menus_dune_option', through: MenuOption, foreignKey: 'id_option', otherKey: 'id_menu'});


////////////////////////////////////////
// --  Lien Article / Produit / Menu  //
////////////////////////////////////////

// Article.hasOne(Menu, { foreignKey: 'article_id', as: 'menu' });
// Article.hasOne(Produit, { foreignKey: 'article_id', as: 'produit' });
//Menu.belongsTo(Article, { foreignKey: 'article_id', as: 'article_menu' });
//Produit.belongsTo(Article, { foreignKey: 'article_id', as: 'article_produit' });


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

// Une ligne de commande appartient à UNE commande
LigneCommande.belongsTo(Commande, {
  as: 'commande_de_la_ligne',
  foreignKey: 'commande_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Une ligne de commande concerne UN article
LigneCommande.belongsTo(Article, {
  as: 'article_de_la_ligne',
  foreignKey: 'article_id',
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE'
});

// Une commande possède PLUSIEURS lignes
Commande.hasMany(LigneCommande, {
  as: 'lignes_de_la_commande',
  foreignKey: 'commande_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});


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

