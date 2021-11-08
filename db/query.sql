SELECT em.id AS ID,
 em.first_name AS First,
 em.last_name AS Last,
 em.role_id AS Role,
 r.salary AS Salary,
 man.last_name AS Manager,
 depar.name AS Department

FROM employee em
LEFT JOIN employee man
ON em.manager_id = man.id

LEFT JOIN role r 
ON em.role_id = r.title

LEFT JOIN department depar
ON r.department_id = depar.id