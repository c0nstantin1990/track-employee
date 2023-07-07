const connection = require("../db/connection");

class Employee {
  constructor(id, firstName, lastName, roleId, managerId) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roleId = roleId;
    this.managerId = managerId;
  }

  static getAllEmployees(callback) {
    const query = `
      SELECT
        e.id, e.first_name, e.last_name, e.role_id, e.manager_id,
        r.title AS role_title, d.name AS department_name,
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM employee AS e
      INNER JOIN role AS r ON e.role_id = r.id
      INNER JOIN department AS d ON r.department_id = d.id
      LEFT JOIN employee AS m ON e.manager_id = m.id
    `;
    connection.query(query, (err, rows) => {
      if (err) {
        return callback(err);
      }
      const employees = rows.map(
        (row) =>
          new Employee(
            row.id,
            row.first_name,
            row.last_name,
            row.role_id,
            row.manager_id
          )
      );
      callback(null, employees);
    });
  }

  save(callback) {
    const query =
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    connection.query(
      query,
      [this.firstName, this.lastName, this.roleId, this.managerId],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        this.id = result.insertId;
        callback(null, this);
      }
    );
  }

  static updateRole(employeeId, roleId, callback) {
    const query = "UPDATE employee SET role_id = ? WHERE id = ?";
    connection.query(query, [roleId, employeeId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.affectedRows > 0);
    });
  }
}

module.exports = Employee;
