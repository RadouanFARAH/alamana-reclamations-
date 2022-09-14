const config = require("../dbconfig");
const mysql = require("mysql2/promise");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const { format } = require("date-fns");

let transporter = nodemailer.createTransport({
  host: process.env.HOST_MAIL,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "alamana.info1@gmail.com", // generated ethereal user
    pass: "fefkezfaokbwycch", // generated ethereal password
  },
});

const filePath = path.join(__dirname, "../assets/template.html");
const source = fs.readFileSync(filePath, "utf-8").toString();
const template = handlebars.compile(source);

//........................................affecter et traiter(deux button) réclamation......................................................................................................
router.post("/Taffecter",verifyToken, async (request, response) => {
  const { reclamation_id, user_id } = request.body;
  console.log(user_id);

  try {
    const connection = await mysql.createConnection(config);
    const [rows0, fields0] = await connection.execute(
      "select * from traitement where reclamation_id=?",
      [reclamation_id.reclamation_id.id]
    );
    const [joursFeries, joursFeriesFields] = await connection.execute("SELECT * from joursFeries");

    const joursferieFinal=[]
    for (let i = 0; i < joursFeries.length; i++) {
      const jf = joursFeries[i];
      let dateD = new Date(jf.date_debut);
      let dateF = new Date(jf.date_fin);

      let currentjf = new Date(dateD);
      while (currentjf <= dateF) {
        joursferieFinal.push(format(new Date(currentjf), "yyyy-MM-dd"));
        currentjf.setDate(currentjf.getDate() + 1);
      }
    }
    const filteredDays = joursferieFinal.filter(function (ele, pos) {
      return joursferieFinal.indexOf(ele) == pos;
    });
  
    filteredDays.sort((a, b) => {
      if (a < b) return 1;
      else if (a > b) return -1;
  
      return 0;
    });
    var currentTraiteur = format(new Date(), "yyyy-MM-dd");
    var currentRespo = format(new Date(), "yyyy-MM-dd");
    var endTraiteur = format(new Date(currentTraiteur).setDate(new Date(currentTraiteur).getDate() + 4), "yyyy-MM-dd");
    var endRespo = format(new Date(currentRespo).setDate(new Date(currentRespo).getDate() + 8), "yyyy-MM-dd");
 
    console.log(endTraiteur)
    console.log(endRespo)
     let cptTraiteur=4
     let cptRespo=8


    while (currentTraiteur<endTraiteur) {
      day = new Date(currentTraiteur).getDay();
      if (day === 0 || day === 6 || filteredDays.includes(currentTraiteur)) {
        cptTraiteur++;
        endTraiteur = format(new Date(endTraiteur).setDate(new Date(endTraiteur).getDate() + 1), "yyyy-MM-dd");
      }
      currentTraiteur = format(new Date(currentTraiteur).setDate(new Date(currentTraiteur).getDate() + 1), "yyyy-MM-dd");
      
    }
    while (currentRespo<endRespo) {
      day = new Date(currentRespo).getDay();
      if (day === 0 || day === 6 || filteredDays.includes(currentRespo)) {
        cptRespo++;
        endRespo = format(new Date(endRespo).setDate(new Date(endRespo).getDate() + 1), "yyyy-MM-dd");
      }
      currentRespo = format(new Date(currentRespo).setDate(new Date(currentRespo).getDate() + 1), "yyyy-MM-dd");
      
    }
    if (rows0.length < 0) {
      const insertTraitement =
        "INSERT INTO traitement(reclamation_id, user_id, date_affectation,cpt_traiteur,cpt_respo) VALUES (?,?,?,?,?)";

      const etatReclamation = "update reclamation set etat=? where id=? ";

      const [rows, fields] = await connection.execute(insertTraitement, [
        reclamation_id.id,
        user_id.id,
        new Date(),
        cptTraiteur,
        cptRespo
      ]);
      const [rows1, fields1] = await connection.execute(etatReclamation, [
        "Non traiter",
        reclamation_id.id,
      ]);

      const replacements = {
        displayName: user_id.displayName,
        message: "Vous avez reçu une nouvelle reclamation",
        path: process.env.FRONT_URL + "/traiter",
      };
      const htmlToSend = template(replacements);

      let info = await transporter.sendMail({
        from: "alamana.info1@gmail.com", // sender address
        to: user_id.ldapUpn, // list of receivers
        subject: "Nouvelle réclamation affecté", // Subject line
        html: htmlToSend, // html body
      });
    } else {
      console.log("first")
      const insertTraitement =
        "UPDATE traitement SET user_id=? , date_affectation=?, cpt_traiteur=?, cpt_respo=? WHERE id=?";

      const [rows, fields] = await connection.execute(insertTraitement, [
        user_id.id,
        new Date(),
        cptTraiteur,
        cptRespo,
        rows0[0].id,
      ]);

      const replacements = {
        displayName: user_id.displayName,
        message: "Vous avez reçu une nouvelle reclamation",
        path: process.env.FRONT_URL + "/traiter",
      };
      const htmlToSend = template(replacements);
      if (
        user_id.ldapUpn &&
        user_id.ldapUpn.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)
      ) {
      let info = await transporter.sendMail({
        from: "alamana.info1@gmail.com", // sender address
        to: user_id.ldapUpn, // list of receivers
        subject: "Nouvelle réclamation affecté", // Subject line
        html: htmlToSend, // html body
      });}
    }

    return response.send({ error: false, message: "Réclamation affecter" });
  } catch (err) {
    console.log(err);
  }
});

//........................................affecter réclamation......................................................................................................
router.post("/affecter", verifyToken, async (request, response) => {
  const { reclamation_id, user_id } = request.body;
  console.log(request.body);

  try {
    

    const connection = await mysql.createConnection(config);


    const [joursFeries, joursFeriesFields] = await connection.execute("SELECT * from joursFeries");

    const joursferieFinal=[]
    for (let i = 0; i < joursFeries.length; i++) {
      const jf = joursFeries[i];
      let dateD = new Date(jf.date_debut);
      let dateF = new Date(jf.date_fin);

      let currentjf = new Date(dateD);
      while (currentjf <= dateF) {
        joursferieFinal.push(format(new Date(currentjf), "yyyy-MM-dd"));
        currentjf.setDate(currentjf.getDate() + 1);
      }
    }
    const filteredDays = joursferieFinal.filter(function (ele, pos) {
      return joursferieFinal.indexOf(ele) == pos;
    });
  
    filteredDays.sort((a, b) => {
      if (a < b) return 1;
      else if (a > b) return -1;
  
      return 0;
    });
    var currentTraiteur = format(new Date(), "yyyy-MM-dd");
    var currentRespo = format(new Date(), "yyyy-MM-dd");
    var endTraiteur = format(new Date(currentTraiteur).setDate(new Date(currentTraiteur).getDate() + 4), "yyyy-MM-dd");
    var endRespo = format(new Date(currentRespo).setDate(new Date(currentRespo).getDate() + 8), "yyyy-MM-dd");
 
    console.log(endTraiteur)
    console.log(endRespo)
     let cptTraiteur=4
     let cptRespo=8


    while (currentTraiteur<endTraiteur) {
      day = new Date(currentTraiteur).getDay();
      if (day === 0 || day === 6 || filteredDays.includes(currentTraiteur)) {
        cptTraiteur++;
        endTraiteur = format(new Date(endTraiteur).setDate(new Date(endTraiteur).getDate() + 1), "yyyy-MM-dd");
      }
      currentTraiteur = format(new Date(currentTraiteur).setDate(new Date(currentTraiteur).getDate() + 1), "yyyy-MM-dd");
      
    }
    while (currentRespo<endRespo) {
      day = new Date(currentRespo).getDay();
      if (day === 0 || day === 6 || filteredDays.includes(currentRespo)) {
        cptRespo++;
        endRespo = format(new Date(endRespo).setDate(new Date(endRespo).getDate() + 1), "yyyy-MM-dd");
      }
      currentRespo = format(new Date(currentRespo).setDate(new Date(currentRespo).getDate() + 1), "yyyy-MM-dd");
      
    }
    // console.log(cptTraiteur)
    // console.log(cptRespo)

    const insertTraitement =
      "INSERT INTO traitement(reclamation_id, user_id, date_affectation,cpt_traiteur,cpt_respo) VALUES (?,?,?,?,?)";

    const etatReclamation = "update reclamation set etat=? where id=? ";
   
    const [rows, fields] = await connection.execute(insertTraitement, [
      reclamation_id.id,
      user_id.id,
      new Date(),
      cptTraiteur,
      cptRespo
    ]);
    const [rows1, fields1] = await connection.execute(etatReclamation, [
      "Non traiter",
      reclamation_id.id,
    ]);

    const replacements = {
      displayName: user_id.displayName,
      message: "Vous avez reçu une nouvelle reclamation",
      path: process.env.FRONT_URL + "/traiter",
    };
    const htmlToSend = template(replacements);
    if (
      user_id.ldapUpn &&
      user_id.ldapUpn.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)
    ) {
    let info = await transporter.sendMail({
      from: "alamana.info1@gmail.com", // sender address
      to: user_id.ldapUpn, // list of receivers
      subject: "Nouvelle réclamation affecté", // Subject line
      html: htmlToSend, // html body
    });}
    return response.send({ error: false, message: "Réclamation affecter" });
  } catch (err) {
    console.log(err);
  }
});
//........................................obtenir reclamation (traiter)............................................................................................................................
router.get("/nontraiter", verifyToken, async (request, response) => {
  const user_id = request.user.id;
  try {
    const connection = await mysql.createConnection(config);

    const traiterGet = "SELECT * from traitement where user_id=? ";
    const [rows, fields] = await connection.execute(traiterGet, [user_id]);

    const traitements = new Array();
    for (let i = 0; i < rows.length; i++) {
      const traitement = rows[i];
      const reclamationGet = "select * from reclamation where id=? and etat=?";
      const [rows1, fields1] = await connection.execute(reclamationGet, [
        traitement.reclamation_id,
        "Non traiter",
      ]);
      if (rows1[0]?.etat === "Non traiter") {
        traitement.reclamation_id = rows1[0];
        const userGet = "select * from user where id=? ";
        const [rows2, fields2] = await connection.execute(userGet, [
          traitement?.reclamation_id?.user_id,
        ]);
        traitement.reclamation_id.user_id = rows2[0];
        traitements.push(traitement);
      }
    }

    return response.send({ error: false, message: traitements });
  } catch (error) {
    console.log(error);
  }
});

//........................................traiter réclamation......................................................................................................
router.post("/traiter",verifyToken, async (request, response) => {
  const { traitement_id } = request.body;
  console.log(request.body);

  try {
    const traiterTraitement =
      "UPDATE traitement SET reponse=?, date_traitement=? where id=?";

    const etatReclamation = "update reclamation set etat=? where id=? ";

    const connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute(traiterTraitement, [
      traitement_id.reponse,
      new Date(),
      traitement_id.id,
    ]);
    const [rows1, fields1] = await connection.execute(etatReclamation, [
      "Non cloturer",
      traitement_id.reclamation_id.id,
    ]);

    return response.send({ error: false, message: "Réclamation traiter" });
  } catch (err) {
    console.log(err);
  }
});

//........................................obtenir reclamation (cloturer)............................................................................................................................
router.get("/noncloturer", verifyToken, async (request, response) => {
  const user_id = request.user.id;
  try {
    const connection = await mysql.createConnection(config);

    const traiterGet = "SELECT * from traitement ";
    const [rows, fields] = await connection.execute(traiterGet);

    const traitements = new Array();
    for (let i = 0; i < rows.length; i++) {
      const traitement = rows[i];
      const reclamationGet = "select * from reclamation where id=? and etat=?";
      const [rows1, fields1] = await connection.execute(reclamationGet, [
        traitement.reclamation_id,
        "Non cloturer",
      ]);
      if (rows1[0]?.etat === "Non cloturer") {
        traitement.reclamation_id = rows1[0];
        const userGet = "select * from user where id=? ";
        const [rows2, fields2] = await connection.execute(userGet, [
          traitement?.reclamation_id?.user_id,
        ]);
        traitement.reclamation_id.user_id = rows2[0];
        traitements.push(traitement);
      }
    }

    const traitementFinale = new Array();
    for (let j = 0; j < traitements.length; j++) {
      const element = traitements[j];
      const userGet = "select * from user where id=? ";
      const [rows3, fields3] = await connection.execute(userGet, [
        element?.user_id,
      ]);
      element.user_id = rows3[0];
      traitementFinale.push(element);
    }
    return response.send({ error: false, message: traitementFinale });
  } catch (error) {
    console.log(error);
  }
});

//........................................cloturer réclamation......................................................................................................
router.post("/cloturer",verifyToken, async (request, response) => {
  const { traitement_id } = request.body;
  console.log(request.body);

  try {
    const traiterTraitement =
      "UPDATE traitement SET  date_cloturation=? where id=?";

    const etatReclamation = "update reclamation set etat=? where id=? ";

    const connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute(traiterTraitement, [
      new Date(),
      traitement_id.id,
    ]);
    const [rows1, fields1] = await connection.execute(etatReclamation, [
      "Cloturer",
      traitement_id.reclamation_id?.id,
    ]);

    return response.send({ error: false, message: "Réclamation cloturer" });
  } catch (err) {
    console.log(err);
  }
});
//........................................relancer réclamation......................................................................................................
router.post("/relancer",verifyToken, async (request, response) => {
  const { traitement_id } = request.body;

  try {
    const connection = await mysql.createConnection(config);

    const [rows, fields] = await connection.execute(
      "UPDATE traitement SET relancer=?, reponse=?, date_traitement=? where id=?  ",
      [traitement_id.relancer, null, null, traitement_id.id]
    );
    const [rows1, fields1] = await connection.execute(
      "update reclamation set etat=? where id=? ",
      ["Non traiter", traitement_id?.reclamation_id.id]
    );

    return response.send({ error: false, message: "Réclamation relancer" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
