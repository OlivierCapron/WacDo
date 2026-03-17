// Pour le lancer
// node ./scripts/init_admin.js à la racinde du projet

const dotenv = require("dotenv");

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

(async () => {

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
});

const [rows] = await pool.query("SELECT COUNT(*) AS count FROM utilisateur");

if (rows[0].count === 0) {
  const hash = await bcrypt.hash("rQzLuq0lkKwXrDUO", 10);

  await pool.query(
    `INSERT INTO utilisateur (identifiant, motDePasse, role, createdAt, updatedAt)
     VALUES (?, ?, ?, NOW(), NOW())`,
    ["admin", hash, "ADMINISTRATION"]
  );

  console.log("premier utilisateur admin créé !");
}

await pool.end();

})();