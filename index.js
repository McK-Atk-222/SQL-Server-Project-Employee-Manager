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
                    
                    mainMenu();
                }
                viewAllDepartments();

                break;

            case 'View all roles':
                async function viewAllRoles() {
                    const res = await client.query('SELECT roles.title, roles.salary, departments.name from roles LEFT JOIN departments on roles.department_id = departments.id');

                    console.table(res.rows);

                    mainMenu();
                }
                viewAllRoles();

                break;

            case 'View all employees':
                async function viewAllEmployees() {
                    const res = await client.query('SELECT employees.first_name, employees.last_name, roles.title, employees.manager_id, roles.salary FROM employees LEFT JOIN roles on employees.role_id = roles.id');

                    console.table(res.rows);

                    mainMenu();
                }
                viewAllEmployees();

                break;

            case 'Add a department':
                async function addDepartment() {
                    const { name }  = await inquirer.prompt({
                        type: 'input',
                        name: 'name',
                        message: 'Enter department name:'
                    });

                    await client.query('INSERT INTO departments (name) VALUES ($1)', [name]);

                    console.log(`Department ${name} added successfully.`);

                    mainMenu();
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

                    const departmentName = await viewAllDepartments()

                    const convertedArray = departmentName.map(dept => {
                        return {
                            value: dept.id,
                            name: dept.name
                        }
                    })

                    const { departmentId } = await inquirer.prompt({
                        type: 'list',
                        name: 'departmentId',
                        message: 'Which department is this role in?',
                        choices: convertedArray, 
                    });
                
                    await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1,$2,$3)',[title,salary,departmentId]);

                    console.log("Role has been added")

                    mainMenu();
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

                    const roleName = await viewAllroles()

                    const convertedArray = roleName.map(role => {
                        return {
                            value: role.id,
                            name: role.title
                        }
                    })

                    const { role } = await inquirer.prompt({
                        type: 'list',
                        name: 'role',
                        message: 'Which role is this employee in?',
                        choices: convertedArray, 
                    });

                    async function viewAllEmployees() {
                        const res = await client.query('SELECT * FROM employees');
                        return res.rows;
                    }

                    const employeeName = await viewAllEmployees()

                    const employeeConvertedArray = employeeName.map(name => {
                        return {
                            value: name.id,
                            name: `${name.first_name} ${name.last_name}`
                        }
                    })

                    employeeConvertedArray.push({
                        value: null,
                        name: 'none'
                    })
                 
                    const { manager } = await inquirer.prompt({ //DOESNT FUNCTION HERE
                        type: 'list',
                        name: 'manager',
                        message: 'Select employees manager:',
                        choices: employeeConvertedArray, 
                    });
                
                    await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3,$4)',[firstName,lastName,role,manager]);

                    console.log('Employee has been Added')

                    mainMenu();
                };
                addEmployee(); 

                break;

                case 'Update an employee role': //UNTESTED BUT MOST LIKELY NOT FUNCTIONING YET
                async function updateEmployee() {
                    async function viewAllEmployees() {
                    const res = await client.query('SELECT * FROM employees');
                    return res.rows;
                }

                const employeeName = await viewAllEmployees()

                const employeeConvertedArray = employeeName.map(name => {
                    return {
                        value: name.id,
                        name: `${name.first_name} ${name.last_name}`
                    }
                })

                const {employeeId} = await inquirer.prompt({
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select an employee to update:',
                    choices: employeeConvertedArray, 
                });

                async function viewAllroles() {
                    const res = await client.query('SELECT * FROM roles');
                    return res.rows;
                }

                const roleName = await viewAllroles()

                const convertedArray = roleName.map(role => {
                    return {
                        value: role.id,
                        name: role.title
                    }
                })

                const { roleId } = await inquirer.prompt({
                    type: 'list',
                    name: 'roleId',
                    message: 'Select updated role:',
                    choices: convertedArray, 
                });

                await client.query('UPDATE employees SET role_id = $1 WHERE id = $2',[roleId,employeeId]);

                console.log('Employee updated')
                mainMenu();
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