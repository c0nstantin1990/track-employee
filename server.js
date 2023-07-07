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
// Adding roles
function addRole() {
  // Retrieving department options from the database
  const departmentQuery = "SELECT id, name FROM department";
  connection.query(departmentQuery, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "roleTitle",
          message: "Enter the title of the role:",
          validate: (input) => {
            if (input.trim() === "") {
              return "Role title cannot be empty.";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Enter the salary for the role:",
          validate: (input) => {
            if (isNaN(input)) {
              return "Salary must be a valid number.";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "departmentId",
          message: "Select the department for the role:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answers) => {
        const { roleTitle, roleSalary, departmentId } = answers;

        const query =
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(
          query,
          [roleTitle, roleSalary, departmentId],
          (err, res) => {
            if (err) throw err;

            console.log("\nRole added successfully!");
            firstPrompt();
          }
        );
      });
  });
}
// Adding employee
function addAnEmployee() {
  // Retrieving role options from the database
  const roleQuery = "SELECT id, title FROM role";
  connection.query(roleQuery, (err, roles) => {
    if (err) throw err;

    // Retrieving manager options from the database
    const managerQuery =
      "SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employee";
    connection.query(managerQuery, (err, managers) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name:",
            validate: (input) => {
              if (input.trim() === "") {
                return "First name cannot be empty.";
              }
              return true;
            },
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name:",
            validate: (input) => {
              if (input.trim() === "") {
                return "Last name cannot be empty.";
              }
              return true;
            },
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            type: "list",
            name: "managerId",
            message: "Select the manager for the employee:",
            choices: [
              { name: "None", value: null },
              ...managers.map((manager) => ({
                name: manager.manager,
                value: manager.id,
              })),
            ],
          },
        ])
        .then((answers) => {
          const { firstName, lastName, roleId, managerId } = answers;

          const query =
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
          connection.query(
            query,
            [firstName, lastName, roleId, managerId],
            (err, res) => {
              if (err) throw err;

              console.log("\nEmployee added successfully!");
              firstPrompt();
            }
          );
        });
    });
  });
}
// Updating employee role
function updateAnEmployeeRole() {
  // Retrieving employee options from the database
  const employeeQuery = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.title AS role
    FROM employee AS e
    INNER JOIN role AS r ON e.role_id = r.id
  `;
  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    // Retrieving role options from the database
    const roleQuery = "SELECT id, title FROM role";
    connection.query(roleQuery, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: employee.employee_name,
              value: employee.id,
            })),
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the new role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          const { employeeId, roleId } = answers;

          const query = "UPDATE employee SET role_id = ? WHERE id = ?";
          connection.query(query, [roleId, employeeId], (err, res) => {
            if (err) throw err;

            console.log("\nEmployee role updated successfully!");
            firstPrompt();
          });
        });
    });
  });
}
