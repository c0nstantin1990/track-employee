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
// Viewing all employees
function viewAllEmployees() {
  const query = `
    SELECT
      e.id AS employee_id,
      e.first_name,
      e.last_name,
      r.title AS job_title,
      d.name AS department,
      r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee AS e
    INNER JOIN role AS r ON e.role_id = r.id
    INNER JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\n---------------------------------------------------------");
    console.log("Employees");
    console.log("---------------------------------------------------------");

    if (res.length === 0) {
      console.log("No employees found.");
    } else {
      console.table(res);
    }

    console.log("---------------------------------------------------------\n");
    firstPrompt();
  });
}
// Adding department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "Enter the name of the department:",
      validate: (input) => {
        if (input.trim() === "") {
          return "Department name cannot be empty.";
        }
        return true;
      },
    })
    .then((answers) => {
      const departmentName = answers.departmentName;

      const query = "INSERT INTO department (name) VALUES (?)";
      connection.query(query, [departmentName], (err, res) => {
        if (err) throw err;

        console.log("\nDepartment added successfully!");
        firstPrompt();
      });
    });
}
