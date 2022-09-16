INSERT INTO departments(name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (title , salary,department_id)
VALUES 
('Sales Lead', 100000 , 1),
('SalesPerson', 300000, 1),
('Lead Engineer', 500000,2),
('Software Engineer', 600000,2),
('Account Manager', 450000,3),
('Accountant', 364000,3),
('Legal Team Lead', 424000,4),
('Lawyer',700000,4);


INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES
('John', 'Doe', 1,NULL),
('Mike', 'Chan', 1,1),
('Ashley', 'Rodriguez', 3,NULL),
('Martin', 'Lawrence', 4,3),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5,NULL),
('Malia', 'Brown', 6, 6),
('Sarah', 'Lourd', 7,NULL),
('Tom', 'Allen', 8, 9);
