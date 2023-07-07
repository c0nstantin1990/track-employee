USE employee_db;

INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");
INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 130000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 137000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 95000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 200000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leonardo", "DiCaprio", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Hanks", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Denzel ", "Washington", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christian", "Bale", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Al", "Pacino", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Johnny", "Depp", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Matt", "Damon", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Keanu", "Reeves", 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dwayne", "Johnson", 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("George", "Clooney", 2, 1);
