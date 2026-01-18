const authorizeRoles = (...rolesAutorises) => 
{
    return (req, res, next) => 
    {
       //console.log("Vérification role utilisateur");
        
        if(!req.utilisateur)
        {
            return res.status(401).json({ message: "Utilisateur non authent" });
        }

       //console.debug("Rôle  :", req.utilisateur.role);
        //console.debug("Rôles autorisés :", rolesAutorises);

        if(!rolesAutorises.includes(req.utilisateur.role))
        {
            console.error("Acces refusé, role non valide");
            return res.status(403).json({ message: "Acces refuse." });
        }

        next();
    }
}

module.exports = authorizeRoles;
