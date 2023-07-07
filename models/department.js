const connection = require("../db/connection");

class Department {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static getAllDepartments(callback) {
    const query = "SELECT id, name FROM department";
    connection.query(query, (err, rows) => {
      if (err) {
        return callback(err);
      }
      const departments = rows.map((row) => new Department(row.id, row.name));
      callback(null, departments);
    });
  }

  save(callback) {
    const query = "INSERT INTO department (name) VALUES (?)";
    connection.query(query, [this.name], (err, result) => {
      if (err) {
        return callback(err);
      }
      this.id = result.insertId;
      callback(null, this);
    });
  }
}

module.exports = Department;
