const mysql = require("mysql");
const inquirer = require("inquirer");
const dotenv = require("dotenv").config();
const logo = require("asciiart-logo");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});
connection.connect(function (err) {
  if (err) throw err;
});
