Projet WacDo


npm init pour creer le package.json


Lancement du projet
node app.js

ou en mode test NODE_ENV=test node app.js

---------------

Creation du premier user Admin : 

NODE_ENV=test node scripts/init_admin.js 

-------------------

Lancement avec la lib PM2

-- OInstallation 

npm install -g pm2

-- Lancement 

pm2 start app.js



-------------------

Documentation Swagger

http://127.0.0.1:5000/api-docs/

