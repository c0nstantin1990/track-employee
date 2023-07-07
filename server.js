const mysql = require("mysql2");
const inquirer = require("inquirer");
const dotenv = require("dotenv").config();
const logo = require("asciiart-logo");

// Creating a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 33060,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

// Connecting to the database and starting the application
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
  firstPrompt();
});

// Displaying the initial user prompt
function firstPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Make a selection:",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
        "Exit",
      ],
    })
    .then(({ task }) => {
      switch (task) {
        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add A Department":
          addDepartment();
          break;

        case "Add A Role":
          addRole();
          break;

        case "Add An Employee":
          addAnEmployee();
          break;

        case "Update An Employee Role":
          updateAnEmployeeRole();
          break;

        case "Exit":
          connection.end();
          console.log("Application terminated.");
          break;
      }
    });
}

// Viewing all employees
function viewAllEmployees() {
  console.log("Viewing employees...\n");

  const query = `
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title, 
      d.name AS department, 
      r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM 
      employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON d.id = r.department_id
      LEFT JOIN employee m ON m.id = e.manager_id
  `;

  connection.query(query, (err, results) => {
    if (err) throw err;

    console.log("Employees viewed!\n");
    console.table(results);

    firstPrompt();
  });
}
