# Employee_Tracker-ch12

This project uses the following technologies:

- Node.js
- MySQL2 package
- Inquirer package
- console.table package
- SQL (Structured Query Language)
- JavaScript
- Git (version control)
- GitHub (remote repository hosting)
- npm (package manager)

## Description

This project is a command-line application that allows a user to manage a company's employee database. The application was built using Node.js, Inquirer, and MySQL. The goal of this project is to create an interface that allows non-developers to easily view and interact with information stored in databases.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [Features](#features)

## Installation

To install this project, please follow these steps:

`1. Clone the repository to your local machine`

`2. Navigate to the project directory`

`3. Install dependencies by running npm install`

`4. Update the connection.js file with your MySQL database credentials`

`5. Use the schema.sql and seeds.sql files to create and populate your database`

`6. Run the application by running node server.js`

- Review the code on the GitHub repository by visiting the [GitHub Repository](https://github.com/etapm/Employee_Tracker-ch12). You can also view the walkthrough video here: [Employee Tracker Walkthrough Video](https://drive.google.com/file/d/1DP9Y9QcaR0my_LIyKWOv_N6UgtW4cLrM/view)

## Dependencies

- MySQL2
- Inquirer
- console.table

## Usage

1.  Navigate to the project directory

    ![root directory](/images/1.png)

2.  Run npm start to start the application

    ![npm start in terminal](/images/2.png)

3.  The application will prompt the user to select from a list of options

    ![sample questions after starting server](/images/3.png)

4.  Select an option from the list, such as viewing all employees, adding an employee, updating an employee's role, and more.

5.  The user will be able to view the information in a table format using the console.table package.

    ![table after selecting view all employees](/images/4.png)

## Credits

N/A

## License

N/A

## Badges

N/A

## Features

This application allows the user to perform the following actions:

- `View all employees, roles, and departments`
- `Add a new employee, role, or department`
- `Update an employee's role or manager`
- `View employees by manager or department`
- `Delete a department, role, or employee`
- `View the total utilized budget of a department`

## How to Contribute

N/A

## Tests

N/A
