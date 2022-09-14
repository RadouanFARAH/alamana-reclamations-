const config = require("../dbconfig");
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const { verifyToken } = require("../middleware/auth");
//........................................obtenir tous les siege............................................................................................................................
router.get("/",verifyToken, async (request, response) => {
  try {
    const connection = await mysql.createConnection(config);
    const sqlGet = "SELECT * from siege";
    const [rows, fields] = await connection.execute(sqlGet);
    return response.send({ error: false, message: rows });
  } catch (error) {
    console.log(error);
  }
});

//........................................obtenir un seul siege....................................................................................................................
router.get("/:id",verifyToken, async (request, response) => {
  const { id } = request.params;

  try {
    const connection = await mysql.createConnection(config);
    const recGet = "SELECT * FROM siege where id = ?";

    const [rows, fields] = await connection.execute(recGet, [id]);

    if (!rows[0]) {
      return response.send({ error: true, message: "id n'existe pas" });
    }
    return response.send({ error: false, message: rows });
  } catch (error) {
    console.log(error);
  }
});

//........................................supprimer  siege......................................................................................................

router.delete("/:id",verifyToken, async (request, response) => {
  const { id } = request.params;

  try {
    const connection = await mysql.createConnection(config);

    const sqlRemove = "DELETE from siege where id = ?";
    const [rows, fields] = await connection.execute(sqlRemove, [id]);

    return response.send({ error: false, message: "siege supprimer" });

  } catch (error) {
    console.log(error);
  }
});

//............................................ajouter siege.......................................................................................................................................;
router.post("/",verifyToken, async (request, response) => {
  const {  code   } = request.body;

  try {
    const connection = await mysql.createConnection(config);
    const insertsiege = "INSERT INTO siege( code,date_creationS  ) VALUES (?,?)";
    const [rows, fields] = await connection.execute(insertsiege, [ code ,new Date() ]);

    return response.send({ error: false, message: "siege ajouter" });

  } catch (err) {
    console.log(err);
  }
});

//............................................modifier siege.......................................................................................................................................;

router.put("/:id",verifyToken, async (request, response) => {
  const { id } = request.params;
  const {  code   } = request.body;

  const connection = await mysql.createConnection(config);
  const sqlUpdate = "UPDATE siege SET  code=?  where id=?";
  const [rows, fields] = await connection.execute(sqlUpdate, [ code  ,id]);
  return response.send({ error: false, message: "siege modifier" });

});

module.exports = router;
