//Make any query you can think of an store it here

const getRides = 'SELECT * FROM rides';
const getEmployees = 'SELECT * FROM employee';
const addEmployee = 'INSERT INTO employee (EmployeeID, FirstName, LastName, JobRole, Email, Address, SupervisorID, username, password) VALUES (?,?,?,?,?,?,?,?,?)';

const getRidesNeedingMaintenance = 'SELECT * FROM rides WHERE MaintenanceNeed = 1';