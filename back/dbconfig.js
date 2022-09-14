const mysql = require("mysql2/promise");

const config =  {
    port: "3306",
    host: "localhost",
    user: "root",
    password: "Root@123",
    database: "mydb",
  };

module.exports = config;
