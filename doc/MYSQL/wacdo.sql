-- Creation de labase de données WacDO

-- On repart from scratch
DROP DATABASE IF EXISTS wacdo;


CREATE DATABASE IF NOT EXISTS wacdo;

USE wacdo;

-- ################
-- # Table client #
-- ################

CREATE TABLE client (
  client_id BIGINT AUTO_INCREMENT NOT NULL ,
  nom VARCHAR(255) NOT NULL,
  PRIMARY KEY (client_id),
  UNIQUE (nom)
) ENGINE=InnoDB;

-- #####################
-- # Table utilisateur #
-- #####################

CREATE TABLE utilisateur (
  utilisateur_id BIGINT NOT NULL AUTO_INCREMENT,
  identifiant VARCHAR(255) NOT NULL,
  mot_passe VARCHAR(255) NOT NULL,
  role ENUM('ADMINISTRATION','PREPARATION','ACCUEIL') NOT NULL,
  PRIMARY KEY (utilisateur_id),
  UNIQUE (identifiant)
) ENGINE=InnoDB;


-- ##############################
-- # Table categorie de produit #
-- ##############################
CREATE TABLE categorie (
  id BIGINT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (nom)
) ENGINE=InnoDB;


-- ########################
-- # Table option de menu #
-- ########################
CREATE TABLE option (
  option_id BIGINT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  description VARCHAR(1000),
  prix DECIMAL(8,2),
  image VARCHAR(255),
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (option_id),
  UNIQUE (nom)
) ENGINE=InnoDB;

-- ##################################
-- # Table article (objet abstrait) #
-- ##################################
CREATE TABLE article (
  article_id BIGINT NOT NULL AUTO_INCREMENT,
  type ENUM('PRODUIT','MENU') NOT NULL,
  nom VARCHAR(255) NOT NULL,
  description VARCHAR(1000),
  prix DECIMAL(8,2),
  image VARCHAR(255),
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (article_id),
  UNIQUE (nom)
) ENGINE=InnoDB;

-- ####################################
-- # Table produit (implem d'article) #
-- # Lien vers une categorie          #
-- # Lien vers un abstract article    #
-- ####################################
CREATE TABLE produit (
  produit_id BIGINT NOT NULL,
  categorie_id BIGINT NOT NULL,
  PRIMARY KEY (produit_id),
  FOREIGN KEY (produit_id) REFERENCES article(article_id),
  FOREIGN KEY (categorie_id) REFERENCES categorie(id)
) ENGINE=InnoDB;

-- #################################
-- # Table menu (implem d'article) #
-- #################################
CREATE TABLE menu (
  menu_id BIGINT NOT NULL,
  PRIMARY KEY (menu_id),
  FOREIGN KEY (menu_id) REFERENCES article(article_id)
) ENGINE=InnoDB;


-- ############################
-- # Table produits des menus #
-- ############################
CREATE TABLE menu_produits (
  menu_produits_id BIGINT NOT NULL   AUTO_INCREMENT,
  id_menu BIGINT NOT NULL,
  id_produit BIGINT   NOT NULL,
  quantite INT NOT NULL,
  PRIMARY KEY (menu_produits_id),
  UNIQUE (id_menu, id_produit),
  FOREIGN KEY (id_menu)   REFERENCES menu(menu_id),
  FOREIGN KEY (id_produit) REFERENCES produit(produit_id)
) ENGINE=InnoDB;

-- ############################
-- # Table options  des menus #
-- ############################
CREATE TABLE menu_options (
  menu_option_id BIGINT NOT NULL AUTO_INCREMENT,
  option_id BIGINT NOT NULL,
  menu_id BIGINT NOT NULL,
  quantite INT NOT NULL,
  PRIMARY KEY (menu_option_id),
  UNIQUE (option_id, menu_id),
  FOREIGN KEY (option_id) REFERENCES option(option_id),
  FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
) ENGINE=InnoDB;




-- ##################
-- # Table commande #
-- ##################

CREATE TABLE commande (
  commande_id BIGINT NOT NULL AUTO_INCREMENT,
  client_id BIGINT NOT NULL,
  tstamp_commande_cree DATETIME,
  tstamp_commande_preparee DATETIME,
  tstamp_commande_livree DATETIME,
  statut ENUM('A_PREPARER','PREPAREE','LIVREE') NOT NULL,
  origine ENUM('COMPTOIR','TELEPHONE') NOT NULL,
  prix_total DECIMAL(8,2),
  prix_total_ttc DECIMAL(8,2),
  commande_createur_id BIGINT,
  commande_preparateur_id BIGINT,
  commande_livreur_id BIGINT,
  PRIMARY KEY (commande_id),
  FOREIGN KEY (client_id) REFERENCES client(client_id),
  FOREIGN KEY (commande_createur_id) REFERENCES utilisateur(utilisateur_id),
  FOREIGN KEY (commande_preparateur_id) REFERENCES utilisateur(utilisateur_id),
  FOREIGN KEY (commande_livreur_id) REFERENCES utilisateur(utilisateur_id)
) ENGINE=InnoDB;



-- ###########################
-- # Table ligne de commande #
-- ###########################
CREATE TABLE ligne_commande (
  ligne_commande_id BIGINT NOT NULL AUTO_INCREMENT,
  commande_id BIGINT NOT NULL,
  article_id BIGINT NOT NULL,
  quantite INT NOT NULL,
  total DECIMAL(8,2),
  total_ttc DECIMAL(8,2),
  PRIMARY KEY (ligne_commande_id),
  FOREIGN KEY (commande_id) REFERENCES commande(commande_id),
  FOREIGN KEY (article_id) REFERENCES article(article_id)
) ENGINE=InnoDB;

