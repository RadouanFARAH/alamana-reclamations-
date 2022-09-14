const config = require("../dbconfig");
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const { verifyToken } = require("../middleware/auth");
//........................................obtenir tous les agence............................................................................................................................
router.get("/",verifyToken, async (request, response) => {
  try {
    const connection = await mysql.createConnection(config);
    const sqlGet = "SELECT * from agence";
    const [rows, fields] = await connection.execute(sqlGet);
    return response.send({ error: false, message: rows });
  } catch (error) {
    console.log(error);
  }
});

//........................................obtenir un seul agence....................................................................................................................
router.get("/:id",verifyToken, async (request, response) => {
  const { id } = request.params;

  try {
    const connection = await mysql.createConnection(config);
    const recGet = "SELECT * FROM agence where id = ?";

    const [rows, fields] = await connection.execute(recGet, [id]);

    if (!rows[0]) {
      return response.send({ error: true, message: "id n'existe pas" });
    }
    return response.send({ error: false, message: rows });
  } catch (error) {
    console.log(error);
  }
});

//........................................supprimer  agence......................................................................................................

router.delete("/:id",verifyToken, async (request, response) => {
  const { id } = request.params;

  try {
    const connection = await mysql.createConnection(config);

    const sqlRemove = "DELETE from agence where id = ?";
    const [rows, fields] = await connection.execute(sqlRemove, [id]);

    return response.send({ error: false, message: "agence supprimer" });

  } catch (error) {
    console.log(error);
  }
});

//............................................ajouter agence.......................................................................................................................................;
router.post("/",verifyToken, async (request, response) => {
  const { code_agence,date_creation } = request.body;

  try {
    const connection = await mysql.createConnection(config);
    const insertagence = "INSERT INTO agence(code_agence,date_creation) VALUES (?,?)";
    const [rows, fields] = await connection.execute(insertagence, [code_agence,new Date()]);

    return response.send({ error: false, message: "agence ajouter" });

  } catch (err) {
    console.log(err);
  }
});

//............................................modifier agence.......................................................................................................................................;

router.put("/:id",verifyToken, async (request, response) => {
  const { id } = request.params;
  const { code_agence } = request.body;

  const connection = await mysql.createConnection(config);
  const sqlUpdate = "UPDATE agence SET code_agence=?  where id=?";
  const [rows, fields] = await connection.execute(sqlUpdate, [code_agence,id]);
  return response.send({ error: false, message: "agence modifier" });

});

module.exports = router;
 