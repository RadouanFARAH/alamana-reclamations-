const express = require("express");
const bodyParser = require("body-parser");
const cookies = require("cookie-parser");
const app = express();
const router = express.Router();
const { format } = require("date-fns");
require("dotenv").config();

var corsOptions = {
  origin: "http://localhost:3000",
};

const config = require("./dbconfig");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

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

const filePath = path.join(__dirname, "./assets/template.html");
const source = fs.readFileSync(filePath, "utf-8").toString();
const template = handlebars.compile(source);

var cron = require("node-cron");

// cron.schedule("0 5 * * *", async () => {
//   try {
//     const connection = await mysql.createConnection(config);

//     const [rows2, fields2] = await connection.execute(
//       "SELECT DISTINCT u.id as uid , u.*,t.id as tid from traitement t join user u on t.user_id=u.id and DATE_ADD(t.date_affectation,INTERVAL t.cpt_traiteur DAY)<? and t.date_traitement IS NULL ",
//       [new Date()]
//     );
//     for (let i = 0; i < rows2.length; i++) {
//       const element = rows2[i];

//       if (
//         element.ldapUpn &&
//         element.ldapUpn.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)
//       ) {
//         const replacements = {
//           displayName: element.displayName,
//           message: "Vous avez des réclamations a traité",
//           path: process.env.FRONT_URL + "/traiter",
//         };
//         const htmlToSend = template(replacements);

//         let info = await transporter.sendMail({
//           from: "alamana.info1@gmail.com", // sender address
//           to: element.ldapUpn, // list of receivers
//           subject: "Nouvelle réclamation non traiter", // Subject line
//           html: htmlToSend, // html body
//         });
//       }
//     }
    
//     const [rows3, fields3] = await connection.execute(
//       "SELECT DISTINCT r.id as 'uid' , r.* , t.id as 'tid' , u.displayName as 'nom' from traitement t join user u on t.user_id=u.id and DATE_ADD(t.date_affectation,INTERVAL t.cpt_respo DAY)<? and t.date_traitement IS NULL  join user r on r.id=u.responsable_id",
//       [new Date()]
//       );


//     for (let i = 0; i < rows3.length; i++) {
//       const element = rows3[i];

//       if (
//         element.ldapUpn &&
//         element.ldapUpn.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)
//       ) {
//         const replacements = {
//           displayName: element.displayName,
//           message: "Réclamation de " + element.nom + " a dépassé le délai",
//           path: process.env.FRONT_URL + "/agence",
//         };
//         const htmlToSend = template(replacements);

//         let info = await transporter.sendMail({
//           from: "alamana.info1@gmail.com", // sender address
//           to: element.ldapUpn, // list of receivers
//           subject: "Nouvelle réclamation non traiter", // Subject line
//           html: htmlToSend, // html body
//         });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });
const cors = require("cors");
app.use(cors())
// app.use(cors({origin:"*"}))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cookies());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//controller
const routerUsers = require("./routes/user");
const routerReclamation = require("./routes/reclamation");
const routerTraitement = require("./routes/traitement");
const routerAgence = require("./routes/agence");
const routerSiege = require("./routes/siege");
const routerDashCard = require("./routes/dashCard");
const routerJoursFeries = require("./routes/JoursFeries");

//routes
app.use("/api/users", routerUsers);
app.use("/api/reclamations", routerReclamation);
app.use("/api/traitements", routerTraitement);
app.use("/api/agences", routerAgence);
app.use("/api/sieges", routerSiege);
app.use("/api/dashCard", routerDashCard);
app.use("/api/joursFeries", routerJoursFeries);

//connexion

const port = 8090;
app.listen(port);
console.log("Order API is runnning at " + port);
