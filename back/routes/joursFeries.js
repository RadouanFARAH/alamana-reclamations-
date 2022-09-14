const config = require("../dbconfig");
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const { verifyToken } = require("../middleware/auth");
const { format }= require ('date-fns')

//........................................obtenir tous les agence............................................................................................................................
router.get("/",verifyToken, async (request, response) => {
  try {
    const connection = await mysql.createConnection(config);
    const sqlGet = "SELECT * from joursFeries";
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
    const recGet = "SELECT * FROM joursFeries where id = ?";

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

    const sqlRemove = "DELETE from joursFeries where id = ?";
    const [rows, fields] = await connection.execute(sqlRemove, [id]);

    return response.send({ error: false, message: "jour Ferie supprimer" });

  } catch (error) {
    console.log(error);
  }
});

//............................................ajouter agence.......................................................................................................................................;
router.post("/",verifyToken, async (request, response) => {
  const {jour_ferie, date_debut,date_fin } = request.body;

  try {
    const connection = await mysql.createConnection(config);
    const insertjours = "INSERT INTO joursFeries(jour_ferie,date_debut,date_fin) VALUES (?,?,?)";
    const [rows, fields] = await connection.execute(insertjours, [jour_ferie,format(new Date(date_debut), 'yyyy-MM-dd')    ,format(new Date(date_fin), 'yyyy-MM-dd') ]);

    return response.send({ error: false, message: "jour Ferie ajouter" });

  } catch (err) {
    console.log(err);
  }
});

//............................................modifier agence.......................................................................................................................................;

router.put("/:id",verifyToken, async (request, response) => {
  const { id } = request.params; 
  const {jour_ferie,date_debut,date_fin} = request.body;

  const connection = await mysql.createConnection(config);
  const sqlUpdate = "UPDATE joursFeries SET jour_ferie=?, date_debut=? ,date_fin =?  where id=?";
  const [rows, fields] = await connection.execute(sqlUpdate, [jour_ferie,format(new Date(date_debut), 'yyyy-MM-dd')    ,format(new Date(date_fin), 'yyyy-MM-dd'),id ]);
  return response.send({ error: false, message: "jour Ferie modifier" });

});

module.exports = router;