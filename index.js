import inquirer from 'inquirer';
import {connectToDb} from './connections.js';

const client = await connectToDb();

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then((answers) => {
        switch (answers.action) {
            case 'View all departments':
                async function viewAllDepartments() {
                    const res = await client.query('SELECT * FROM departments');
                    console.table(res.rows);
                }
                viewAllDepartments();

                break;

            case 'View all roles':
                async function viewAllRoles() {
                    const res = await client.query('SELECT * FROM roles');
                    console.table(res.rows);
                }
                viewAllRoles();

                break;

            case 'View all employees':
                async function viewAllEmployees() {
                    const res = await client.query('SELECT * FROM employees');
                    console.table(res.rows);
                }
                viewAllEmployees();

                break;

            case 'Add a department':
                async function addDepartment() {
                    const name  = await inquirer.prompt({
                        type: 'input',
                        name: 'name',
                        message: 'Enter department name:'
                    });
                    await client.query('INSERT INTO departments (name) VALUES ($1)', [name]);
                    console.log(`Department ${name} added successfully.`);
                }
                addDepartment();

                break;

            case 'Add a role':
                async function addRole() {
                    const { title } = await inquirer.prompt({
                        type: 'input',
                        name: 'title',
                        message: 'Enter the title of the role:'
                    });

                    const { salary } = await inquirer.prompt({
                        type: 'input',
                        name: 'salary',
                        message: 'Enter the salary for this role:',
                        validate: (input) => {
                            const isNumber = !isNaN(input);
                            return isNumber || 'Please enter a valid number';
                        }
                    });

                    async function viewAllDepartments() {
                        const res = await client.query('SELECT * FROM departments');
                        return res.rows;
                    }

                    const departmentName = viewAllDepartments()

                    const { department } = await inquirer.prompt({
                        type: 'list',
                        name: 'departmentId',
                        message: 'Which department is this role in?',
                        choices: departmentName, 
                    });
                
                const res = await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1,$2,$3)',[title,salary,department]);
                    console.table(res.rows);

                };
                addRole(); 

                break;
                
            case 'Add an employee':
                async function addEmployee() {
                    const { firstName } = await inquirer.prompt({
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter employees first name:'
                    });

                    const { lastName } = await inquirer.prompt({
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter employees last name:',
                    });

                    async function viewAllroles() {
                        const res = await client.query('SELECT * FROM roles');
                        return res.rows;
                    }

                    const roleName = viewAllroles()

                    const { role } = await inquirer.prompt({
                        type: 'list',
                        name: 'roleId',
                        message: 'Which role is this employee in?',
                        choices: roleName, 
                    });

                    const { manager } = await inquirer.prompt({
                        type: 'input',
                        name: 'manager',
                        message: 'Enter employees manager:'
                    });
                
                const res = await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3,$4)',[firstName,lastName,role,manager]);
                    console.table(res.rows);

                };
                addEmployee(); 

                break;

                case 'Update an employee':
                async function updateEmployee() {
                    async function viewAllEmployees() {
                    const res = await client.query('SELECT * FROM employees');
                    return res.rows;
                }

                const employeeName = viewAllEmployees()

                const { department } = await inquirer.prompt({
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select an employee to update:',
                    choices: employeeName, 
                });
                async function viewAllroles() {
                    const res = await client.query('SELECT * FROM roles');
                    return res.rows;
                }

                const roleName = viewAllroles()

                const { role } = await inquirer.prompt({
                    type: 'list',
                    name: 'roleId',
                    message: 'Select updated role:',
                    choices: roleName, 
                });

                const res = await client.query('UPDATE INTO employees (role_id) VALUES ($1)',[role]);
                console.table(res.rows);

                };
                updateEmployee(); 

                break;

            case 'Exit':
                console.log('Exiting...');
                process.exit();
        }
    });
}

mainMenu();