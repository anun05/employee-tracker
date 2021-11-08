// to start I a inquirer promt need view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const inquirer = require('inquirer');
const mysql = require('mysql2')
const ctable = require('console.table');

// creating the connection for the sql i  database 
const connection = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'emptracker_db'
    },
    console.log(`Connected to the emptracker_db database.`)
);
connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected mySQL!');

    chooseOp();
});

// the main body script that will run the function 

function chooseOp() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: 'What would you like to do?',
            choices: ['View', 'Add', 'Update an Employee Role', 'Quit']
        }
    ])
        .then(function (res) {
            switch (res.userChoice) {
                case "View":
                    view();
                    break;
                case "Add":
                    add();
                    break;
                case "Update an Employee Role":
                    update();
                    break;
                case "Quit":
                    console.log('All Done!')
                    break;
                default:
            }
        })


}

// creating the functions that will run the 'View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit'
function view() {
    inquirer.prompt([
        {
            name: "view",
            type: "list",
            message: "Select what you would like to view: ",
            choices: ["All employees", "All Departments", "All roles"]
        }
    ]).then(function (res) {
        switch (res.view) {
            case "All employees":
                viewEmployees();
                break;
            case "All Departments":
                viewDepartments();
                break;
            case "All roles":
                viewRoles();
            default:
        }
    })
}
function viewDepartments() {
    connection.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                choices: function () {
                    var choiceArray = [];
                    for (i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].name)

                    }
                    return choiceArray;
                },
                message: 'Select Department',
            },
        ]).then(function (answer) {
            connection.query('SELECT em.id AS ID, em.first_name AS First, em.last_name AS Last, em.role_id AS Role, r.salary AS Salary, man.last_name AS Manager, depar.name AS Department FROM employee em LEFT JOIN employee man ON em.manager_id = man.id LEFT JOIN role r ON em.role_id = r.title LEFT JOIN department depar ON r.department_id = depar.id WHERE depar.name=?', [answer.choice], function (err, results) {
                if (err) throw err;
                console.table(results);
                chooseOp();
            })
        })
    })
}

function viewRoles() {
    connection.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Which role are you picking?',
                choices: function () {
                    var choiceArray = [];
                    for (i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].name)

                    }
                    return choiceArray;
                }
            }
        ]).then(function (answer) {
            connection.query('SELECT em.id AS ID, em.first_name AS First, em.last_name AS Last, em.role_id AS Role, r.salary AS Salary, man.last_name AS Manager, depar.name AS Department FROM employee em LEFT JOIN employee man ON em.manager_id = man.id LEFT JOIN role r ON em.role_id = r.title LEFT JOIN department depar ON r.department_id = depar.id WHERE em.role_id=?', [answer.choice], function (err, results) {
                if (err) throw err;
                console.table(results);
                chooseOp();
            })
        })
    })
}

function viewEmployees() {
    connection.query('SELECT em.id AS ID, em.first_name AS First, em.last_name AS Last, em.role_id AS Role, r.salary AS Salary, man.last_name AS Manager, depar.name AS Department FROM employee em LEFT JOIN employee man ON em.manager_id = man.id LEFT JOIN role r ON em.role_id = r.title LEFT JOIN department depar ON r.department_id = depar.id', function (err, results) {
        if (err) throw err;
        console.table(results);
        chooseOp();
    })
}
// adding the different functions 

function add() {
    inquirer.prompt([
        {
            name: "add",
            type: "list",
            message:"what would you like to add.",
            choices:["Department", "Employee's role", "Employee"]

        }
    ]).then(function(res){
        switch (res.add) {
            case "Department":
                addDepart();
                break;
            case "Employee's role":
                addRole();
                break;
            case "Employee":
                addEmployee();
            default:
        }
    })
}

function addDepart() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'Department',
            message: 'Which department will you be adding?',
        }
    ]).then(function (answer) {
        connection.query('INSERT INTO department VALUES (DEFAULT, ?)'),
            [answer.department],
            function (err) {
                if (err) throw err;
                console.log('Department added: ' + answer.department);
                chooseOp();
            }
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Which role will you be adding?',
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Enter salary.',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: 'number',
            name: 'department_id',
            message: 'Which department will you be adding this role to?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },

    ]).then(function (answer) {
        connection.query('INSERT INTO role SET ?', {
            title: answer.role,
            salary: answer.salary,
            department_id: answer.department_id
        },
            function (err) {
                if (err) throw err;
                console.log('Role added and updated: ' + answer.role);
                chooseOp();
            }
        )
    })
}

function addEmployee() {
    connection.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'first',
                message: 'Enter employee first name.',
            },
            {
                type: 'input',
                name: 'last',
                message: 'Enter employee last name.',

            },
            {
                type: 'list',
                name: 'role',
                choices: function () {
                    var choiceArray = [];
                    for (i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].title)

                    }
                    return choiceArray;
                },
                message: 'Select title for name',
            },
            {
                type: 'number',
                name: 'manager',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
                message: 'Enter manager id',
                default: '1'
            },

        ]).then(function (answer) {
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role,
                    manager_id: answer.manager
                },

            )
            console.log('Employee Added, Welcome!'),
                chooseOp()
        });
    });
}
function update() {
    connection.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                choices: function () {
                    var choiceArray = [];
                    for (i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].last_name)

                    }
                    return choiceArray;
                },
                message: 'Enter employee to update position.',
            },
        ])
            .then(function (answer) {
                const save = answer.choice;

                connection.query('SELECT * FROM employee',
                    function (err, results) {
                        if (err) throw err;
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'role',
                                choices: function () {
                                    var choiceArray = [];
                                    for (i = 0; i < results.length; i++) {
                                        choiceArray.push(results[i].role_id)

                                    }
                                    return choiceArray;
                                },
                                message: 'Select updated role'
                            },
                            {
                                type: 'number',
                                name: 'manager',
                                validate: function (value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    }
                                    return false;
                                },
                                message: 'Enter manager id',
                                default: '1'
                            },
                        ])
                            .then(function (answer) {
                                console.log(answer);
                                console.log(save);
                                connection.query('UPDATE employee SET ? WHERE last_name = ?',
                                    [
                                        {
                                            role_id: answer.role,
                                            manager_id: answer.manager
                                        }, save
                                    ]),
                                    console.log('Employee updated');
                                chooseOp();
                            })
                    })
            })
    })
}