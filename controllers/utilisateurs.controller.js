
const Utilisateur = require("../models/utilisateur.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PasswordValidator = require("password-validator");
const validator = require('password-validator');

// WS router.get('/',auth,getUtilisateurs);
exports.getUtilisateurs = async (req, res) => {

    try { 
        const utilisateurs = await Utilisateur.findAll({
           attributes: { exclude: ['motDePasse'] }
        });

        res.status(200).json(utilisateurs);
    }
    catch (err) {
        res.status(500).json({ error: "Erreur lors de la recuperation des utilisateurs / " +err});

    }
};

// WS router.get('/:id',auth,  getUtilisateurDetails);
exports.getUtilisateurDetails = async (req, res) => {

    try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id, {
      attributes: { exclude: ['motDePasse'] }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur  non trouvé" });
    }

    res.status(200).json(utilisateur);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du détail utilisateur / " + err });
  }
};

// WS router.post('/',auth,createUtilisateur);
exports.createUtilisateur = async (req, res) => {

     try {
        const { identifiant, motDePasse, role } = req.body;
        if (!identifiant || !motDePasse) {
            return res.status(400).json({ message: 'identifiant et mot de passe obligatoires' });
        }

        const schema  = new PasswordValidator();
        /* On verifie qu'il ya 8 char , des majuscules, des chiffres et pas d'espace */
        schema.is().min(8).has().uppercase().has().digits().has().not().spaces();
        if(!schema.validate(motDePasse))
        {

             return res.status(400).json({ message: "Mot de passe trop faible" });

        }
        const existingUtilisateur = await Utilisateur.findOne({ where: { identifiant } });
        if (existingUtilisateur) {
            return res.status(400).json({ message: "Compte déjà existant" });
        }


        const hashMotDePasse = await bcrypt.hash(motDePasse, 10);

        const utilisateur = await Utilisateur.create({
            identifiant: identifiant,
            motDePasse: hashMotDePasse, 
            role : role
        });


        await utilisateur.save();
        res.status(201).json(utilisateur);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur server" });
    }
};

// WS router.put('/:id',auth,  editUtilisateur);
exports.editUtilisateur = async (req, res) => {

     try {
    const { id } = req.params;
    const { identifiant, motDePasse, role } = req.body;

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Si un nouveau mot de passe est fourni alor son le reprocesss
    let hashedMotDePasse = utilisateur.motDePasse;
    if (motDePasse) {
      const schema = new PasswordValidator();
      schema.is().min(8).has().uppercase().has().digits().has().not().spaces();
      if (!schema.validate(motDePasse)) {
        return res.status(400).json({ message: "Mot de passe trop faible" });
      }
      hashedMotDePasse = await bcrypt.hash(motDePasse, 10);
    }

    await utilisateur.update({
      identifiant: identifiant || utilisateur.identifiant,
      motDePasse: hashedMotDePasse,
      role: role ? role.toUpperCase() : utilisateur.role
    });

    res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur / " + err });
  }
};

// WS router.delete('/:id',auth,  deleteUtilisateur);
exports.deleteUtilisateur = async (req, res) => {

    try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await utilisateur.destroy();
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur / " + err });
  }
};

// WS  router.get('/roles',auth,  getRoles)
exports.getRoles = async (req, res) => {
 try {
    res.status(200).json(ROLES);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des rôles / " + err });
  }
   
};

// WS  router.post('/auth/login',loginUtilisateur);
exports.loginUtilisateur = async (req, res) => {

      try {
        const { identifiant, motDePasse } = req.body;
        if (!identifiant || !motDePasse) {
            return res.status(400).json({ message: 'identifiant et mot de passe obligatoires' });
        }
        const existingUtilisateur = await Utilisateur.findOne({ where: { identifiant } });
        if (!existingUtilisateur) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }
        const isPasswordCorrect = await bcrypt.compare(motDePasse, existingUtilisateur.motDePasse);

        if(!isPasswordCorrect)
        {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

            console.log('Utilisateur ayant deamnde le token : ', existingUtilisateur.utilisateur_id);

        

        const token = jwt.sign( 
            {utilisateur_id: existingUtilisateur.utilisateur_id} // c'est id sequirel et non pas _id
                ,process.env.JWT_SECRET,
                {expiresIn : '7d'}
            
            );

            res.status(200).json({token, utilisateur : existingUtilisateur});
    }
    catch (err) {
        console.error(err);

        res.status(500).json({ message: "Erreur server" });

    }
};


