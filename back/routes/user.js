const config = require("../dbconfig");
const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { loginValidation } = require("../validation");
const mysql = require("mysql2/promise");
const { verifyToken } = require("../middleware/auth");
//........................................login............................................................................................................................


router.post("/login", async (request, response) => {
  const { sAMAccountName, password } = request.body;
  const values = [sAMAccountName];
  const userGet = "SELECT * FROM user where sAMAccountName=? ";
  if (!sAMAccountName || !password) {
    return response.send({
      error: "true",
      message: "entrer votre sAMAccountName et password",
    });
  } else {
    var ldap = require("ldapjs");
    var client = ldap.createClient({
      url: "ldap://" + process.env.LDAP_URL,
      timeout: 500,
      connectTimeout: 500,
    });

    client.bind(sAMAccountName + "@alamana.org.ma" || process.env.LDAP_USERNAME, password || process.env.LDAP_PASSWORD, (err, res) => {
      if (err) {
        if (
          err.lde_message &&
          err.lde_message
            .toString()
            .substring(
              err.lde_message.indexOf("data") + 5,
              err.lde_message.indexOf("data") + 8
            ) === "52e"
        ) {
          return response.send({ error: true, message: "mot de passe non valide" });
        } else if (
          err.lde_message &&
          err.lde_message
            .toString()
            .substring(
              err.lde_message.indexOf("data") + 5,
              err.lde_message.indexOf("data") + 8
            ) === "525​"
        ) {
          return response.send({ error: true, message: "identifiant non valide" });

        } else if (
          err.lde_message &&
          err.lde_message
            .toString()
            .substring(
              err.lde_message.indexOf("data") + 5,
              err.lde_message.indexOf("data") + 8
            ) === "532​"
        ) {
          return response.send({ error: true, message: "mot de passe expiré" });
        } else if (
          err.lde_message &&
          err.lde_message
            .toString()
            .substring(
              err.lde_message.indexOf("data") + 5,
              err.lde_message.indexOf("data") + 8
            ) === "775"
        ) {
          return response.send({ error: true, message: "compte bloqué" });
        } else {
          return response.send({ error: true, message: "erreur de système" });
        }
      } else {
        var opts = {
          filter: `(sAMAccountName=${sAMAccountName})`,
          scope: "sub",
          attributes: [
            "description",
            "physicalDeliveryOfficeName",
            "initials",
            "mail",
            "displayName",
            "sAMAccountName",
          ],
        };
        client.search(process.env.LDAP_BASEDN, opts, function (err, res) {
          if (err) {
            return response.send({ error: true, message: "erreur de système" });
          } else {
            let users = [];
            let errors = [];
            res.on("searchEntry", function (entry) {
              let user = JSON.parse(JSON.stringify(entry.object));
              users.push(user);
            });
            res.on("error", function (err) {
              errors.push(err);
            });
            res.on("end", () => {
              if (errors.length > 0) {
                return response.send({ error: true, message: "erreur de système" });
              } else if (users.length === 0) {
                return response.send({ error: true, message: "utilisateur non valide" });
              } else {
                let user = users[0];
                user.role = sAMAccountName.substring(0, 2);
                let authorized = process.env.AUTHORIZED.split(',')
                if (authorized.includes(user.role)) {
                  const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
                  return response
                    .cookie("access_token", token, {
                      httpOnly: true,
                    })
                    .send({ error: false, message: { token, user } });
                } else {
                  if (user.sAMAccountName === "dsicped3") {
                    user.role  = "gs"
                    const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
                    return response
                      .cookie("access_token", token, {
                        httpOnly: true,
                      })
                      .send({ error: false, message: { token, user } });
                  } else {
                    return response.send({ error: true, message: "vous n'êtes pas authorisé" });
                  }
                }
              }
            });
          }
        });
      }
    })
    // const connection = await mysql.createConnection(config);
    // const [rows, fields] = await connection.execute(userGet, values);
    // if (rows.length < 1) {
    //   return response.send({ error: true, message: "user n'existe pas" });
    // } else {
    //   const user = rows[0];
    //   const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
    //   return response
    //     .cookie("access_token", token, {
    //       httpOnly: true,
    //     })
    //     .send({ error: false, message: { token, user } });
    // }

    // try {
    //     const userGet = await "SELECT * FROM user where sAMAccountName=? AND password=?";
    //     config.query(userGet, values, (err, result) => {
    //         return response.send({ error: false, message: result })
    //     })
    // }
    // catch (error) {
    //     console.log(error);
    // }

    // Token login
    // const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
    // return res
    //     .cookie("access_token", token, {
    //         httpOnly: true,
    //     })
    // .send({ error: false, message: { token, user } })
  }
});

//........................................obtenir tous les utilisateurs............................................................................................................................
router.get("/All", verifyToken, async (request, response) => {
  try {
    const sqlGet = "SELECT * from user order by id desc";
    const users = new Array();
    const connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute(sqlGet);

    for (let i = 0; i < rows.length; i++) {
      const user = rows[i];
      user.useragence = new Array();
      user.usersiege = new Array();
      const [rows0, fields0] = await connection.execute(
        "select * from user where id=?",
        [user.responsable_id]
      );
      user.responsable_id = rows0[0] || null;
      if (user.agence == "agence") {
        const [rows1, fields1] = await connection.execute(
          "select * from useragence where user_id=?",
          [user.id]
        );

        for (let j = 0; j < rows1.length; j++) {
          const agence_id = rows1[j].agence_id;
          const [rows2, fields2] = await connection.execute(
            "select * from agence where id=?",
            [agence_id]
          );
          user.useragence.push(rows2[0]);
        }
      } else {
        const [rows1, fields1] = await connection.execute(
          "select * from usersiege where user_id=?",
          [user.id]
        );

        if (rows1.length !== 0) {
          const siege_id = rows1[0].siege_id;
          const [rows2, fields2] = await connection.execute(
            "select * from siege where id=?",
            [siege_id]
          );
          rows1[0].siege_id = rows2[0]
          user.usersiege.push(rows1[0]);
        }
      }
      users.push(user);
    }

    return response.send({ error: false, message: users });
  } catch (error) {
    console.log(error);
  }
});

//........................................obtenir un seul utilisateur....................................................................................................................
router.get("/:id", verifyToken, async (request, response) => {
  const { id } = request.params;
  //verification id existe ou pas
  const userGet = await "SELECT * FROM user where id = ?";

  config.query(userGet, id, (err, res) => {
    if (!res[0]) {
      return response.send({ error: true, message: "id n'existe pas" });
    }
  });

  try {
    const userGet = await "SELECT * FROM user where id = ?";
    config.query(userGet, id, (err, result) => {
      return response.send({ error: false, message: result });
    });
  } catch (error) {
    console.log(error);
  }
});

//........................................supprimer  utilisateur......................................................................................................

router.delete("/:id", verifyToken, async (request, response) => {
  const { id } = request.params;

  try {
    const connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute(
      "delete from useragence where user_id=? ",
      [id]
    );
    const [rows2, fields2] = await connection.execute(
      "delete from usersiege where user_id=? ",
      [id]
    );
    const [rows1, fields1] = await connection.execute(
      "DELETE from user where id = ?",
      [id]
    );




    return response.send({ error: false, message: "utilisateur supprimer" });
  } catch (error) {
    console.log(error);
  }
});

//........................................ajouter utilisateur......................................................................................................
router.post("/", verifyToken, async (request, response) => {
  const {
    cn,
    displayName,
    sAMAccountName,
    role,
    agence,
    ldapUpn,
    responsable_id,
    useragence,
    usersiege
  } = request.body;

  try {
    const insertUser =
      "INSERT INTO user(cn, displayName, sAMAccountName, role,agence,ldapUpn,responsable_id, date_inscription)  VALUES (?,?,?,?,?,?,?,?)";

    const connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute(insertUser, [
      cn,
      displayName,
      sAMAccountName,
      role,
      agence,
      ldapUpn,
      responsable_id ? responsable_id.id : null,

      new Date(),
    ]);
    console.log(rows)
    if (agence == "agence") {
      const [rows1, fields1] = await connection.execute(
        "select * from user where sAMAccountName=?",
        [sAMAccountName]
      );
      for (let i = 0; i < useragence.length; i++) {
        const agence = useragence[i];
        const [rows2, fields2] = await connection.execute(
          "INSERT INTO useragence(agence_id,user_id) VALUES (?,?)",
          [agence.id, rows1[0].id]
        );
      }
    } else {
      const [rows1, fields1] = await connection.execute(
        "select * from user where sAMAccountName=?",
        [sAMAccountName]
      );
      const siege = usersiege[0];
      console.log(siege)
      const [rows2, fields2] = await connection.execute(
        "INSERT INTO usersiege(user_id,departement) VALUES (?,?)",
        [rows1[0].id, siege.departement]
      );
    }
    return response.send({ error: false, message: "utilisateur ajouter" });
  } catch (err) {
    console.log(err);
  }
});

//........................................modifier utilisateur......................................................................................................

router.put("/:id", verifyToken, async (request, response) => {
  const { id } = request.params;
  const {
    cn,
    displayName,
    sAMAccountName,
    role,
    agence,
    ldapUpn,
    responsable_id,

    useragence,
    usersiege
  } = request.body;

  const sqlUpdate =
    "UPDATE user SET cn=?, displayName=?, sAMAccountName=?, role=?,agence=?,ldapUpn=?,responsable_id=? where id=?";

  const connection = await mysql.createConnection(config);
  const [rows, fields] = await connection.execute(sqlUpdate, [
    cn,
    displayName,
    sAMAccountName,
    role,
    agence,
    ldapUpn,
    responsable_id ? responsable_id.id : null,

    id,
  ]);

  const [rows1, fields1] = await connection.execute(
    "delete from useragence where user_id=? ",
    [id]
  );
  const [rows3, fields3] = await connection.execute(
    "delete from usersiege where user_id=? ",
    [id]
  );

  if (agence === "agence") {
    for (let i = 0; i < useragence.length; i++) {
      const agence = useragence[i];
      const [rows2, fields2] = await connection.execute(
        "INSERT INTO useragence(agence_id,user_id) VALUES (?,?)",
        [agence.id, id]
      );
    }
  } else {
    const siege = usersiege[0];
    const [rows2, fields2] = await connection.execute(
      "INSERT INTO usersiege(user_id,departement) VALUES (?,?)",
      [id, siege.departement]
    );
  }
  return response.send({ error: false, message: "utilisateur modifier" });
});
module.exports = router;
