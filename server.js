const inquirer = require("inquirer");
const connection = require("./db/connection");
const logo = require("asciiart-logo");

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
// Viewing all departments
function viewAllDepartments() {
  const query = "SELECT id, name AS department_name FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\n-------------------------");
    console.log("Departments");
    console.log("-------------------------");

    if (res.length === 0) {
      console.log("No departments found.");
    } else {
      console.table(res);
    }

    console.log("-------------------------\n");
    firstPrompt();
  });
}
// Viewing all roles
function viewAllRoles() {
  const query = `
    SELECT r.id AS role_id, r.title, r.salary, d.name AS department_name
    FROM role AS r
    INNER JOIN department AS d ON r.department_id = d.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\n------------------------------------");
    console.log("Roles");
    console.log("------------------------------------");

    if (res.length === 0) {
      console.log("No roles found.");
    } else {
      console.table(res);
    }

    console.log("------------------------------------\n");
    firstPrompt();
  });
}
