INSERT INTO department (name) 
VALUES ("HR"),
       ("Tech"),
       ("Store Associates"),
       ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("HR Rep", 90000, 1),
       ("Store manager", 100000, 3),
       ("2nd manager", 80000, 3),
       ("3rd manager",70000, 3), 
       ("4th manager",65000, 3), 
       ("Level 7", 50000, 3), 
       ("Level 6", 45000, 3),
       ("Software Engineer", 120000, 2),
       ("Tech associate", 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tiffany", "Nunez", 1, null),
       ("Chris", "Hernandez", 3, 1234),
       ("Amber", "Loftin", 3, null),
       ("Eddy", "Cruz", 3, null),
       ("Britt", "Noman", 3, null),
       ("Avi", "Nunez", 3, null),
       ("Casper", "The ghost", 3, null),
       ("Alex", "Nunez", 2, null),
       ("Drew", "Diaz", 4, null);