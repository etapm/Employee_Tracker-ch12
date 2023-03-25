const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const fs = require("fs");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

async function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

getConnection()
  .then(async (connection) => {
    console.log(`Connected as ID ${connection.threadId}\n`);

    const schema = fs.readFileSync("./db/schema.sql").toString();

    try {
      const result = await connection.promise().query(schema);
      console.log("Schema created successfully");
    } catch (err) {
      throw err;
    }

    // Call the seedDatabase function after connecting to the database
    seedDatabase();

    // Define the 'queries' object here, after getting the connection
    const queries = {
      connection: connection,
      viewAllEmployees: async () => {
        return connection.promise().query(`
          SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
          FROM employee e
          LEFT JOIN role r ON e.role_id = r.id
          LEFT JOIN department d ON r.department_id = d.id
          LEFT JOIN employee m ON e.manager_id = m.id;
        `);
      },
      viewAllRoles: async () => {
        return connection.promise().query("SELECT * FROM role");
      },
      viewAllDepartments: async () => {
        return connection.promise().query("SELECT * FROM department");
      },
      addRole: async (role) => {
        return connection.promise().query("INSERT INTO role SET ?", role);
      },
      addDepartment: async (department) => {
        return connection
          .promise()
          .query("INSERT INTO department SET ?", department);
      },
      updateEmployeeRole: async (employeeId, roleId) => {
        return connection
          .promise()
          .query("UPDATE employee SET role_id = ? WHERE id = ?", [
            roleId,
            employeeId,
          ]);
      },
      addEmployee: async (employee) => {
        return connection
          .promise()
          .query("INSERT INTO employee SET ?", employee);
      },
    };

    queries.connection.query("USE employee_db");

    return queries;
  })
  .then(startCLI)
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

async function seedDatabase() {
  try {
    const data = await fs.promises.readFile("./db/seeds.sql", "utf8");
    const sqlStatements = data
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of sqlStatements) {
      await pool.promise().query(statement);
    }
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

async function startCLI(queries) {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "Add employee",
        "Update employee role",
        "View all roles",
        "Add role",
        "View all departments",
        "Add department",
        "Quit",
      ],
    },
  ]);

  switch (answer.action) {
    case "View all employees":
      await viewAllEmployees(queries);
      break;
    case "Add employee":
      await addEmployee(queries);
      break;
    case "Update employee role":
      await updateEmployeeRole(queries);
      break;
    case "View all roles":
      await viewAllRoles(queries);
      break;
    case "Add role":
      await addRole(queries);
      break;
    case "View all departments":
      await viewAllDepartments(queries);
      break;
    case "Add department":
      await addDepartment(queries);
      break;
    case "Quit":
      await queries.connection.end();
      break;
    default:
      console.log(`Invalid action: ${answer.action}`);
      break;
  }
  startCLI(queries);
}

async function viewAllEmployees(queries) {
  try {
    const [rows] = await queries.viewAllEmployees();
    console.table(rows);
  } catch (err) {
    throw err;
  }
}

async function updateEmployeeRole(queries) {
  try {
    const [employees] = await queries.viewAllEmployees();
    const [roles] = await queries.viewAllRoles();

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to assign to the selected employee?",
        choices: roleChoices,
      },
    ]);

    await queries.updateEmployeeRole(answers.employeeId, answers.roleId);
    console.log("Employee role updated successfully!");
  } catch (err) {
    throw err;
  }
}

async function viewAllRoles(queries) {
  try {
    const [rows] = await queries.viewAllRoles();
    console.table(rows);
  } catch (err) {
    throw err;
  }
}

async function addRole(queries) {
  try {
    const [departments] = await queries.viewAllDepartments();

    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the role title:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the role salary:",
      },
      {
        type: "list",
        name: "department_id",
        message: "Select the department for this role:",
        choices: departmentChoices,
      },
    ]);

    const newRole = {
      title: answers.title,
      salary: answers.salary,
      department_id: answers.department_id,
    };

    await queries.addRole(newRole);
    console.log("Role added successfully!");
  } catch (err) {
    throw err;
  }
}

async function viewAllDepartments(queries) {
  try {
    const [rows] = await queries.viewAllDepartments();
    console.table(rows);
  } catch (err) {
    throw err;
  }
}

async function addDepartment(queries) {
  try {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the department name:",
      },
    ]);

    const newDepartment = {
      name: answer.name,
    };

    await queries.addDepartment(newDepartment);
    console.log("Department added successfully!");
  } catch (err) {
    throw err;
  }
}

async function addEmployee(queries) {
  try {
    const [roles] = await queries.viewAllRoles();
    const [employees] = await queries.viewAllEmployees();

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const managerChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    managerChoices.push({ name: "None", value: null });

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
      },
      {
        type: "list",
        name: "role_id",
        message: "Select the employee's role:",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is your manager?",
        choices: managerChoices,
      },
    ]);

    const newEmployee = {
      first_name: answers.first_name,
      last_name: answers.last_name,
      role_id: answers.role_id,
      manager_id: answers.manager_id || null,
    };

    await queries.addEmployee(newEmployee); // Replace pool.query with queries.addEmployee
    console.log("Employee added successfully!");
  } catch (err) {
    throw err;
  }
}
