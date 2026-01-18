const Utilisateur = require("../models/utilisateur.model");

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = async (req, res, next) => {
    console.log("Entree dans auth");

    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: "Connectez vous" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Connectez vous" });
    }

    //console.log("Token de recherche " + token);

    try {
        const decodedUtilisateurId = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("Donnees du token token :", decodedUtilisateurId);
        //console.log("Id user du token token :", decodedUtilisateurId.utilisateur_id);

        const utilisateurAuthentifie =  await Utilisateur.findByPk(decodedUtilisateurId.utilisateur_id, {
      attributes: { exclude: ['motDePasse'] }
    });
            //console.log("Utilisateur decodé a partir du token :", utilisateurAuthentifie);

        req.utilisateur = utilisateurAuthentifie;
        next();
    } catch (err) {
        //console.error("Erreur de vérification du token:", err);
        return res.status(401).json({ message: 'Token invalide' });
    }
};
 
module.exports = auth;