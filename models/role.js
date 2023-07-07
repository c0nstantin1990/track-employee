const connection = require("../db/connection");

class Role {
  constructor(id, title, salary, departmentId) {
    this.id = id;
    this.title = title;
    this.salary = salary;
    this.departmentId = departmentId;
  }

  static getAllRoles(callback) {
    const query = `
      SELECT r.id, r.title, r.salary, r.department_id, d.name AS department_name
      FROM role AS r
      INNER JOIN department AS d ON r.department_id = d.id
    `;
    connection.query(query, (err, rows) => {
      if (err) {
        return callback(err);
      }
      const roles = rows.map(
        (row) => new Role(row.id, row.title, row.salary, row.department_id)
      );
      callback(null, roles);
    });
  }

  save(callback) {
    const query =
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
    connection.query(
      query,
      [this.title, this.salary, this.departmentId],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        this.id = result.insertId;
        callback(null, this);
      }
    );
  }
}

module.exports = Role;
