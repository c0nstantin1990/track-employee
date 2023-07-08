const mysql = require("mysql2");
const dotenv = require("dotenv").config();

// Creating a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

module.exports = connection;
