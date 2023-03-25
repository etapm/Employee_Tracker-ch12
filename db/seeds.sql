USE employee_db;

INSERT INTO department (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Lead', 100000, 1),
  ('Salesperson', 80000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Accountant', 125000, 3),
  ('Legal Team Lead', 250000, 4),
  ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Bill', 'Kapri', 1, NULL),
  ('Trevor', 'Noah', 2, 1),
  ('Gary', 'Payton II', 3, NULL),
  ('Demarcus', 'Cousins', 4, 3),
  ('Rajon', 'Rondo', 5, 3),
  ('Dame', 'Dash', 6, NULL),
  ('Aaliyah', 'Haughton', 7, 6);