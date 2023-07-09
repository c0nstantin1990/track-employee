const inquirer = require("inquirer");
const connection = require("./db/connection");
require("console.table");
const figlet = require("figlet");

// Connecting to the database and starting the application
displayTrackEmployee();
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
  firstPrompt();
});

// Displaying the "Track Employee" ASCII
function displayTrackEmployee() {
  figlet("Track\nEmployee", (err, data) => {
    if (err) {
      console.log("Error displaying ASCII:", err);
      return;
    }
    console.log(data);
    console.log("\n");
  });
}

// Displaying the initial user prompt
function firstPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "View Employees By Manager",
        "View Employees by Department",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
        "Update An Employee Manager",
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

        case "View Employees By Manager":
          viewEmployeesByManager();
          break;

        case "View Employees by Department":
          viewEmployeesByDepartment();
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

        case "Update An Employee Manager":
          updateAnEmployeeManager();
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
  const query = "SELECT id, name AS department FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    if (res.length === 0) {
      console.log("No departments found.");
    } else {
      console.table(res);
    }
    firstPrompt();
  });
}
// Viewing all roles
function viewAllRoles() {
  const query = `
    SELECT r.id AS id, r.title, d.name AS department, r.salary 
    FROM role AS r
    INNER JOIN department AS d ON r.department_id = d.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    if (res.length === 0) {
      console.log("No roles found.");
    } else {
      console.table(res);
    }
    firstPrompt();
  });
}
// Viewing all employees
function viewAllEmployees() {
  const query = `
    SELECT
      e.id AS id,
      e.first_name,
      e.last_name,
      r.title AS title,
      d.name AS department,
      r.salary,
      CONCAT(m.first_name, m.last_name) AS manager
    FROM employee AS e
    INNER JOIN role AS r ON e.role_id = r.id
    INNER JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id
  `;

  connection.query(query, (err, res) => {
    if (err) {
      console.error("Error retrieving employees:", err);
      return;
    }
    console.log("\n");
    if (res.length === 0) {
      console.log("No employees found.");
    } else {
      console.table(res);
    }

    firstPrompt();
  });
}

// Viewing employees by manager
function viewEmployeesByManager() {
  // Retrieving manager options from the database
  const managerQuery = `
    SELECT DISTINCT CONCAT(m.first_name, ' ', m.last_name) AS manager_name, m.id AS manager_id
    FROM employee AS e
    LEFT JOIN employee AS m ON e.manager_id = m.id
    WHERE m.id IS NOT NULL
  `;
  connection.query(managerQuery, (err, managers) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "list",
          name: "managerId",
          message: "Select a manager to view their employees:",
          choices: managers.map((manager) => ({
            name: manager.manager_name,
            value: manager.manager_id,
          })),
        },
      ])
      .then((answers) => {
        const { managerId } = answers;

        const query = `
          SELECT
            e.id AS id,
            e.first_name,
            e.last_name,
            r.title AS title,
            d.name AS department,
            r.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM employee AS e
          INNER JOIN role AS r ON e.role_id = r.id
          INNER JOIN department AS d ON r.department_id = d.id
          LEFT JOIN employee AS m ON e.manager_id = m.id
          WHERE e.manager_id = ?
        `;
        connection.query(query, [managerId], (err, res) => {
          if (err) {
            console.error("Error retrieving employees:", err);
            return;
          }
          console.log("\n");
          if (res.length === 0) {
            console.log("No employees found for the selected manager.");
          } else {
            console.table(res);
          }

          firstPrompt();
        });
      });
  });
}

// Viewing employees by department
function viewEmployeesByDepartment() {
  // Retrieving department options from the database
  const departmentQuery = "SELECT id, name FROM department";
  connection.query(departmentQuery, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select a department to view its employees:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answers) => {
        const { departmentId } = answers;

        const query = `
          SELECT
            e.id AS id,
            e.first_name,
            e.last_name,
            r.title AS title,
            d.name AS department,
            r.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM employee AS e
          INNER JOIN role AS r ON e.role_id = r.id
          INNER JOIN department AS d ON r.department_id = d.id
          LEFT JOIN employee AS m ON e.manager_id = m.id
          WHERE d.id = ?
        `;
        connection.query(query, [departmentId], (err, res) => {
          if (err) {
            console.error("Error retrieving employees:", err);
            return;
          }
          console.log("\n");
          if (res.length === 0) {
            console.log("No employees found for the selected department.");
          } else {
            console.table(res);
          }

          firstPrompt();
        });
      });
  });
}

// Adding department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "What is the name of the department?",
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

        console.log("\nAdded to the database");
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
          message: "What is the name of the role?",
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
          message: "What is the salary of the role?",
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
          message: "Which department does the role belong to?",
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

            console.log("\nAdded to the database");
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
            message: "What is the employee's first name?",
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
            message: "What is the employee's last name?",
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
            message: "What is the employee's role?",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
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

              console.log("\nAdded to the database");
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
            message: "Which employee's role do you want to update?",
            choices: employees.map((employee) => ({
              name: employee.employee_name,
              value: employee.id,
            })),
          },
          {
            type: "list",
            name: "roleId",
            message: "Which role do you want to assign the selected employee?",
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

            console.log("\nUpdated employee's role");
            firstPrompt();
          });
        });
    });
  });
}
// Updating employee manager
function updateAnEmployeeManager() {
  // Retrieving employee options from the database
  const employeeQuery = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee AS e
    LEFT JOIN employee AS m ON e.manager_id = m.id
  `;
  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's manager do you want to update?",
          choices: employees.map((employee) => ({
            name: `${employee.employee_name} (Manager: ${
              employee.manager_name || "None"
            })`,
            value: employee.id,
          })),
        },
        {
          type: "list",
          name: "managerId",
          message: "Select the new manager for the employee:",
          choices: employees.map((employee) => ({
            name: employee.employee_name,
            value: employee.id,
          })),
        },
      ])
      .then((answers) => {
        const { employeeId, managerId } = answers;

        const query = "UPDATE employee SET manager_id = ? WHERE id = ?";
        connection.query(query, [managerId, employeeId], (err, res) => {
          if (err) throw err;

          console.log("\nUpdated employee's manager");
          firstPrompt();
        });
      });
  });
}
