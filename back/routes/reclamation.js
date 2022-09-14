const config = require("../dbconfig");
const express = require("express");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const mysql = require("mysql2/promise");
const multer = require("multer");
var moment = require('moment');
//........................................file............................................................................................................................
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });
//........................................Recherche par CIN...................
router.post("/findprospect", verifyToken, async (request, response) => {
  try {

    var cin = request.body.cin;
    var codeGest = request.body.codeGest;
    let dt = {
      cin, codeGest
    }
    result = await callfindCIN(dt);
    
    return response.send({ error: result?false:true, message: result })
  } catch (error) {
    return response.send({ error: true, message: null });
  }
});

//........................................obtenir tous les reclamations............................................................................................................................
router.get("/", verifyToken, async (request, response) => {

  try {
    const user_id = request.user.id;

    const connection = await mysql.createConnection(config);

    const sqlGet = "SELECT * from reclamation where user_id=? order by id desc";

    const [rows, fields] = await connection.execute(sqlGet, [user_id]);
    const reclamations = new Array();
    for (let i = 0; i < rows.length; i++) {
      const reclamation = rows[i];
      const userGet = "SELECT * from user where id=?";

      const [rows1, fields1] = await connection.execute(userGet, [
        reclamation.user_id,
      ]);
      reclamation.user_id = rows1[0];
      // const agenceGet = "SELECT * from agence where id=?";

      // const [rows2, fields2] = await connection.execute(agenceGet, [
      //   reclamation.agence_id,
      // ]);
      // reclamation.agence_id = rows2[0];
      reclamations.push(reclamation);
    }

    return response.send({ error: false, message: reclamations });
  } catch (error) {
    console.log(error);
  }
});

//........................................obtenir tous les reclamations(3user)............................................................................................................................
router.get("/reclamation", verifyToken, async (request, response) => {
  const user_id = request?.user?.id;

  const connection = await mysql.createConnection(config);
  const userGet = "SELECT * from user where id=? ";
  const [rows, fields] = await connection.execute(userGet, [user_id]);
  if (rows[0]?.role == "g") {
    try {
      const connection = await mysql.createConnection(config);

      const userGet = "SELECT * from user where role=? or role=? ";
      const [rows, fields] = await connection.execute(userGet, ["cc", "ac"]);

      const reclamations = new Array();
      for (let i = 0; i < rows.length; i++) {
        const utilisateur = rows[i];
        const reclamationsGet =
          "SELECT * from reclamation where  user_id=? and traitement=?";
        const traitementGet = "SELECT * from traitement where reclamation_id=?";
        const traiteurGet = "SELECT * from user where id=?";

        const [rows1, fields1] = await connection.execute(reclamationsGet, [
          utilisateur.id,
          "Au niveau central",
        ]);

        for (let j = 0; j < rows1.length; j++) {
          const reclamation = rows1[j];
          const [rows2, fields2] = await connection.execute(traitementGet, [
            reclamation.id,
          ]);
          if (rows2.length > 0) {
            const [rows3, fields3] = await connection.execute(traiteurGet, [
              rows2[0].user_id,
            ]);
            reclamation.traitement_id = rows2[0];
            reclamation.traitement_id.user_id = rows3[0];
          } else {
            reclamation.traitement_id = null;
          }
          reclamation.user_id = utilisateur;
          reclamations.push(reclamation);
        }
      }

      console.log(reclamations);
      return response.send({ error: false, message: reclamations });
    } catch (error) {
      console.log(error);
    }
  } else if (
    rows[0]?.role == "ca" ||
    rows[0]?.role == "ds" ||
    rows[0]?.role == "dr" ||
    rows[0]?.role == "gs"
  ) {
    try {
      const connection = await mysql.createConnection(config);

      const userGet = "SELECT * from user where role=? or role=? ";
      const [rows, fields] = await connection.execute(userGet, ["cc", "ac"]);

      const reclamations = new Array();
      for (let i = 0; i < rows.length; i++) {
        const utilisateur = rows[i];
        const reclamationsGet =
          "SELECT * from reclamation where  user_id=? and traitement=?";
        const traitementGet = "SELECT * from traitement where reclamation_id=?";
        const traiteurGet = "SELECT * from user where id=?";

        const [rows1, fields1] = await connection.execute(reclamationsGet, [
          utilisateur.id,
          "Au niveau local",
        ]);

        for (let j = 0; j < rows1.length; j++) {
          const reclamation = rows1[j];
          const [rows2, fields2] = await connection.execute(traitementGet, [
            reclamation.id,
          ]);
          if (rows2.length > 0) {
            const [rows3, fields3] = await connection.execute(traiteurGet, [
              rows2[0].user_id,
            ]);
            reclamation.traitement_id = rows2[0];
            reclamation.traitement_id.user_id = rows3[0];
          } else {
            reclamation.traitement_id = null;
          }
          reclamation.user_id = utilisateur;
          reclamations.push(reclamation);
        }
      }

      return response.send({ error: false, message: reclamations });
    } catch (error) {
      console.log(error);
    }
  } else if (rows[0]?.role == "cd" || rows[0]?.role == "gr") {
    try {
      const connection = await mysql.createConnection(config);

      const userGet = "SELECT * from user where role=? or role=? or role=? ";
      const [rows, fields] = await connection.execute(userGet, [
        "cc",
        "ac",
        "gr",
      ]);

      const reclamations = new Array();
      for (let i = 0; i < rows.length; i++) {
        const utilisateur = rows[i];
        const reclamationsGet = "SELECT * from reclamation  where  user_id=? ";
        const traitementGet = "SELECT * from traitement where reclamation_id=?";
        const traiteurGet = "SELECT * from user where id=?";

        const [rows1, fields1] = await connection.execute(reclamationsGet, [
          utilisateur.id,
        ]);

        for (let j = 0; j < rows1.length; j++) {
          const reclamation = rows1[j];
          const [rows2, fields2] = await connection.execute(traitementGet, [
            reclamation.id,
          ]);
          if (rows2.length > 0) {
            const [rows3, fields3] = await connection.execute(traiteurGet, [
              rows2[0].user_id,
            ]);
            reclamation.traitement_id = rows2[0];
            reclamation.traitement_id.user_id = rows3[0];
          } else {
            reclamation.traitement_id = null;
          }
          reclamation.user_id = utilisateur;
          reclamations.push(reclamation);
        }
      }

      return response.send({ error: false, message: reclamations });
    } catch (error) {
      console.log(error);
    }
  }
});

//........................................obtenir tous les reclamations gestionaire(central)............................................................................................................................
router.get("/gestionnaire", verifyToken, async (request, response) => {
  try {
    const connection = await mysql.createConnection(config);

    const userGet = "SELECT * from user where role=? or role=? ";
    const [rows, fields] = await connection.execute(userGet, ["cc", "ac"]);

    const reclamations = new Array();
    for (let i = 0; i < rows.length; i++) {
      const utilisateur = rows[i];
      const reclamationsGet =
        "SELECT * from reclamation where  user_id=? and traitement=?";
      const traitementGet = "SELECT * from traitement where reclamation_id=?";
      const traiteurGet = "SELECT * from user where id=?";

      const [rows1, fields1] = await connection.execute(reclamationsGet, [
        utilisateur.id,
        "Au niveau central",
      ]);

      for (let j = 0; j < rows1.length; j++) {
        const reclamation = rows1[j];
        const [rows2, fields2] = await connection.execute(traitementGet, [
          reclamation.id,
        ]);
        if (rows2.length > 0) {
          const [rows3, fields3] = await connection.execute(traiteurGet, [
            rows2[0].user_id,
          ]);
          reclamation.traitement_id = rows2[0];
          reclamation.traitement_id.user_id = rows3[0];
        } else {
          reclamation.traitement_id = null;
        }
        reclamation.user_id = utilisateur;
        reclamations.push(reclamation);
      }
    }

    return response.send({ error: false, message: reclamations });
  } catch (error) {
    console.log(error);
  }
});
//........................................obtenir tous les reclamations chefagence(local)............................................................................................................................
router.get("/chefagence", verifyToken, async (request, response) => {
  try {
    const connection = await mysql.createConnection(config);

    const userGet = "SELECT * from user where role=? or role=? ";
    const [rows, fields] = await connection.execute(userGet, ["cc", "ac"]);

    const reclamations = new Array();
    for (let i = 0; i < rows.length; i++) {
      const utilisateur = rows[i];
      const reclamationsGet =
        "SELECT * from reclamation where  user_id=? and traitement=?";
      const traitementGet = "SELECT * from traitement where reclamation_id=?";
      const traiteurGet = "SELECT * from user where id=?";

      const [rows1, fields1] = await connection.execute(reclamationsGet, [
        utilisateur.id,
        "Au niveau local",
      ]);

      for (let j = 0; j < rows1.length; j++) {
        const reclamation = rows1[j];
        const [rows2, fields2] = await connection.execute(traitementGet, [
          reclamation.id,
        ]);
        if (rows2.length > 0) {
          const [rows3, fields3] = await connection.execute(traiteurGet, [
            rows2[0].user_id,
          ]);
          reclamation.traitement_id = rows2[0];
          reclamation.traitement_id.user_id = rows3[0];
        } else {
          reclamation.traitement_id = null;
        }
        reclamation.user_id = utilisateur;
        reclamations.push(reclamation);
      }
    }

    return response.send({ error: false, message: reclamations });
  } catch (error) {
    console.log(error);
  }
});
//........................................obtenir tous les reclamations resp departement............................................................................................................................
router.get("/responsable", verifyToken, async (request, response) => {
  try {
    const connection = await mysql.createConnection(config);

    const userGet = "SELECT * from user where role=? or role=? or role=? ";
    const [rows, fields] = await connection.execute(userGet, [
      "cc",
      "ac",
      "gr",
    ]);

    const reclamations = new Array();
    for (let i = 0; i < rows.length; i++) {
      const utilisateur = rows[i];
      const reclamationsGet = "SELECT * from reclamation  where  user_id=? ";
      const traitementGet = "SELECT * from traitement where reclamation_id=?";
      const traiteurGet = "SELECT * from user where id=?";

      const [rows1, fields1] = await connection.execute(reclamationsGet, [
        utilisateur.id,
      ]);

      for (let j = 0; j < rows1.length; j++) {
        const reclamation = rows1[j];
        const [rows2, fields2] = await connection.execute(traitementGet, [
          reclamation.id,
        ]);
        if (rows2.length > 0) {
          const [rows3, fields3] = await connection.execute(traiteurGet, [
            rows2[0].user_id,
          ]);
          reclamation.traitement_id = rows2[0];
          reclamation.traitement_id.user_id = rows3[0];
        } else {
          reclamation.traitement_id = null;
        }
        reclamation.user_id = utilisateur;
        reclamations.push(reclamation);
      }
    }

    return response.send({ error: false, message: reclamations });
  } catch (error) {
    console.log(error);
  }
});

//........................................supprimer  utilisateur......................................................................................................

router.delete("/:id", verifyToken, async (request, response) => {
  const { id } = request.params;

  const userGet = await "SELECT * FROM user where id = ?";

  config.query(userGet, id, (err, res) => {
    if (!res[0]) {
      return response.send({ error: true, message: "id n'existe pas" });
    }
  });

  try {
    const sqlRemove = "DELETE from reclamation where Id = ?";
    config.query(sqlRemove, id, (err, res) => {
      return response.send({ error: false, message: "réclamation supprimer" });
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/downloadfile", verifyToken, async (request, response) => {
  file = request.body.file;
  try {
    return response.download("files/" + file);
  } catch (error) {
    console.log(error);
  }
});

//............................................ajouter reclamation.......................................................................................................................................;
router.post(
  "/",
  verifyToken,
  upload.single("file"),
  async (request, response) => {
    const user_id = request?.user?.id;
    const {
      nom,
      prenom,
      cin,
      adress,
      tiers,
      telephone,
      type,
      communication,
      traitement,
      client,
      calification,
      description,
      sous_type,
    } = request.body;

    const file = request.file;

    try {
      const connection = await mysql.createConnection(config);
      const insertReclamation =
        "INSERT INTO reclamation(nom,prenom,cin,adress,tiers,telephone,type,communication,traitement,user_id,etat,date_reception,client,calification,description,sous_type,file) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      const [rows, fields] = await connection.execute(insertReclamation, [
        nom,
        prenom,
        cin,
        adress,
        tiers,
        telephone,
        type,
        communication,
        traitement,
        user_id,
        "Non affecter",
        new Date(),
        client,
        calification,
        description,
        sous_type,
        file ? file.filename : null,
      ]);

      return response.send({ error: false, message: "réclamation ajouter" });
    } catch (err) {
      console.log(err);
    }
  }
);

//.......................................................modifier reclamation...................................................................................................................................
router.put(
  "/:id",
  verifyToken,
  upload.single("file"),
  async (request, response) => {
    // const { id } = request.params;
    const {
      id,
      nom,
      prenom,
      cin,
      adress,
      tiers,
      telephone,
      type,
      communication,
      traitement,
      client,
      calification,
      description,
      sous_type,
    } = request.body;
    const user_id = request.user.id;
    const file = request.file;
    console.log(file);
    console.log(id);

    try {
      if (file?.filename) {
        const connection = await mysql.createConnection(config);
        const updateReclamation =
          "UPDATE reclamation SET nom=?,prenom=?,cin=?,adress=?,tiers=?,telephone=?,type=?,communication=?,traitement=?,client=?,calification=?,description=?,sous_type=?,file=? where id=? AND etat=?";
        const [rows, fields] = await connection.execute(updateReclamation, [
          nom,
          prenom,
          cin,
          adress,
          tiers,
          telephone,
          type,
          communication,
          traitement,
          client,
          calification,
          description,
          sous_type,
          file ? file.filename : null,
          id,
          "Non affecter",
        ]);
      } else {
        const connection = await mysql.createConnection(config);
        const updateReclamation =
          "UPDATE reclamation SET nom=?,prenom=?,cin=?,adress=?,tiers=?,telephone=?,type=?,communication=?,traitement=?,client=?,calification=?,description=?,sous_type=? where id=? AND etat=?";
        const [rows, fields] = await connection.execute(updateReclamation, [
          nom,
          prenom,
          cin,
          adress,
          tiers,
          telephone,
          type,
          communication,
          traitement,
          client,
          calification,
          description,
          sous_type,
          id,
          "Non affecter",
        ]);
      }

      return response.send({ error: false, message: "réclamation modifier" });
    } catch (err) {
      console.log(err);
    }
  }
);

//........................................obtenir tous les reclamations chef agence(local)............................................................................................................................
// router.get("/chefagence", verifyToken, async (request, response) => {
//   try {
//     const connection = await mysql.createConnection(config);

//     const userGet = "SELECT * from user where role=? or role=? ";
//     const [rows, fields] = await connection.execute(userGet, ["cc", "ac"]);

//     const reclamations = new Array();
//     for (let i = 0; i < rows.length; i++) {
//       const utilisateur = rows[i];
//       const reclamationsGet = "SELECT * from reclamation where  user_id=?";
//       const traitementGet = "SELECT * from traitement where reclamation_id=?";
//       const traiteurGet = "SELECT * from user where id=?";

//       const [rows1, fields1] = await connection.execute(reclamationsGet, [
//         utilisateur.id,
//       ]);

//       for (let j = 0; j < rows1.length; j++) {
//         const reclamation = rows1[j];
//         const [rows2, fields2] = await connection.execute(traitementGet, [
//           reclamation.id,
//         ]);
//         if (rows2.length > 0) {
//           const [rows3, fields3] = await connection.execute(traiteurGet, [
//             rows2[0].user_id,
//           ]);
//           reclamation.traitement_id = rows2[0];
//           reclamation.traitement_id.user_id = rows3[0];
//         } else {
//           reclamation.traitement_id = null;
//         }
//         reclamation.user_id = utilisateur;
//         reclamations.push(reclamation);
//       }
//     }

//     return response.send({ error: false, message: reclamations });
//   } catch (error) {
//     console.log(error);
//   }
// });


async function callfindCIN(datta) {
  let reslt;
  reslt = await findCIN(datta);
  reslt = reslt?JSON.parse(reslt):null

  return new Promise((resolve, reject) => {
    if (reslt) {
      if (reslt.LIBMSG == "Tiers inexistant") {
        return resolve(null);
      } else {
        var obj = reslt.role;
        var newArrayDataOfOjbect = Object.keys(obj).map(function (key) {
          return obj[key];
        });
        if (reslt.dateNaiss !== "00000000") {
          var dnaissance = moment(reslt.dateNaiss, "YYYYMMDD");
          dnaissance = dnaissance.format("YYYY-MM-DD");
        } else {
          var dnaissance = null;
        }
        if (reslt.dateExpCIN !== "00000000") {
          var dateExpCIN = moment(reslt.dateExpCIN, "YYYYMMDD");
          dateExpCIN = dateExpCIN.format("YYYY-MM-DD");
        } else {
          var dateExpCIN = null;
        }
        var rib =
          "" +
          reslt.code_Bq +
          "" +
          reslt.code_G +
          "" +
          reslt.num_compt +
          "" +
          reslt.numRIB;
        var justif = "" + reslt.zoneUR + "" + reslt.zone;
        var data = {
          numTier: reslt.numTier,
          // role:newArrayDataOfOjbect[0],
          nom: reslt.nom,
          titre: reslt.titre,
          habita: reslt.habitat,
          rue: reslt.rue,
          datecinexp: dateExpCIN,
          cin: reslt.cin,
          quartier: reslt.quartier,
          prenom: reslt.prenom,
          codepostale: reslt.codePostal,
          ville: reslt.ville,
          gsm2: reslt.tel,
          gsm: reslt.gsm,
          canal: reslt.canal,
          codeActivite: reslt.codeActivite,
          rib: rib,
          justif: justif,
          typelocal: reslt.typeLocal,
          dnaissance: dnaissance,
          situationFamilliale: reslt.etat_civil,
          niveauetude: reslt.niv_etude,
          lieudenaissance: reslt.lieu_naissance,
          codeGest: reslt.codeGest,
          origine: reslt.origine,
          secteur: reslt.secteur,
          bidonville:
            reslt.bidonville === ""
              ? 0
              : reslt.bidonville === "N"
                ? 0
                : parseInt(reslt.bidonville, 10),
        };
        return resolve(data)
      }
    } else {
      return resolve(null);
    }
  });
}


const header = {
  AuthHeader: { login: "APP", pwd: "APP@2019" },
};
const jsdom = require("jsdom");
const { json } = require("body-parser");
const { JSDOM } = jsdom;

async function findCIN(args) {
  let url = process.env.PHP_WS_URL;
  console.log("PHP URL :", url);
  let soap = require("soap");
  return new Promise((resolve, reject) => {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    soap.createClient(url, (err, client) => {
      if (err) {
        console.log("error creation de client soap : ", err);
        resolve(null)
      }else{
        client.addSoapHeader(header);
        client.rechercheTier(args, (err, result) => {
          var sortie = result.data;
          let dom = new JSDOM(sortie);
          sortie = dom.window.document.querySelector("retour").textContent;
          console.log("resolved result of search :", sortie);
          resolve(sortie);
        });
      }
    })
  })
}


module.exports = router;
