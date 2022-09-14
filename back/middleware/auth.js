require("dotenv").config();

const jsonwebtoken = require("jsonwebtoken");

const config = require("../dbconfig");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const { Console } = require("console");

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

const verifyToken = async (req, res, next) => {
  console.log("cookies :", req.cookies);
  const token = req.cookies.access_token;
  // if (!token) {
  //   return res.send({ error: true, message: "Vous n'êtes pas connecté" });
  // }
  // try {
  //   const data = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
  //   req.user = data.user;
  // } catch {
  //   console.log("Vous n'êtes pas connecté");
  // }
  return next();
};

const verifyTokenAndAc = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.sn.search("ac") != -1) {
      return next();
    } else {
      return res.send({
        error: true,
        message: "Vous n'avez pas l'autorisation",
      });
    }
  });
};
const verifyTokenAndCr = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.sn.search("cr") != -1) {
      return next();
    } else {
      return res.send({
        error: true,
        message: "Vous n'avez pas l'autorisation",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAc,
  verifyTokenAndCr,
};
