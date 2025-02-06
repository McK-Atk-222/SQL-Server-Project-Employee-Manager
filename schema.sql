DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

\c business_db;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  FOREIGN KEY (department_id)
  REFERENCES departments(id)
  ON DELETE SET NULL
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  FOREIGN KEY (role_id)
  REFERENCES roles(id)
  -- FOREIGN KEY (manager_id)
  -- REFERENCES managers(id)
  ON DELETE SET NULL
);

