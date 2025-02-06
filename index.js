const inquirer = require('inquirer');

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
                break;
            case 'View all roles':
                async function viewAllRoles() {
                    const res = await client.query('SELECT * FROM roles');
                    console.table(res.rows);
                }
                break;
            case 'View all employees':
                async function viewAllEmployees() {
                    const res = await client.query('SELECT * FROM employees');
                    console.table(res.rows);
                }
                break;
            case 'Add a department':
                async function addDepartment(departmentName) {
                    const res = await client.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
                    console.log(`Department ${departmentName} added successfully.`);
                }
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
                
                    const { department } = await inquirer.prompt({
                        type: 'list',
                        name: 'departmentId',
                        message: 'Which department is this role in?',
                        choices: ${departmentName}
                        }
                    });
                
                    // Call the addRole function with the gathered input
                    await addRole (title, salary, department);
                }
                break;
            case 'Add an employee':
                // function to add an employee
                break;
            case 'Update an employee role':
                // function to update employee role
                break;
            case 'Exit':
                console.log('Exiting...');
                process.exit();
        }
    });
}

mainMenu();