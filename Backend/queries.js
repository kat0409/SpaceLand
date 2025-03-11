//Make any query you can think of an store it here

const getRides = 'SELECT * FROM rides';

const getEmployees = 'SELECT * FROM employee';

const addEmployee = 'INSERT INTO employee (FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus) VALUES (?,?,?,?,?,?,?,?,?)';

const getRidesNeedingMaintenance = 'SELECT * FROM rides WHERE MaintenanceNeed = 1';

const addMaintenance = 'INSERT INTO maintenance (RideID, MaintenanceStartDate, MaintenanceEndDate, MaintenanceEmployeeID, eventID) VALUES (?,?,?,?,?,)';

const getMerchandiseTransactions = 'SELECT * FROM merchandiseTransactions';

const addMerchandiseTransaction = 'INSERT INTO merchandiseTransactions (VisitorID, transactionDate, quantity, totalAmount) VALUES (?,?,?,?)';

const addRestaurant = 'INSERT INTO restaurant (restaurantName, mealPlanTier) VALUES (?,?)';

const getMealPlans = 'SELECT * FROM restaurant';

const getRestaurantTransactions = 'SELECT * FROM restaurantTransactions';

const addRestaurantTransaction = 'INSERT INTO restaurantTransactions (restaurantID, VisitorID, transactionDate, Amount) VALUES (?, ?, ?, ?)';

const getSupervisors = 'SELECT * FROM supervisors';

const getSupervisorIDbyDept = 'SELECT SupervisorID FROM supervisors WHERE departmentName = ?';

const updateEmployeeForDeletion = 'UPDATE employee SET employmentStatus = 0 WHERE EmployeeID = ?';

const updateEmployeeForRehire = 'UPDATE employee SET employmentStatus = 1 WHERE EmployeeID = ?';


//getRestaurantTransactions
//getTickets
//addTickets
//getTicketTransactions
//getVisitors
//addVisitor
//getAllVisitors
//getOneVisitor
//getDisabledVisitors
//getWeather
//getInclementWeather
//getDaysClosedForWeather
//addDayClosedForWeather
//setEmployeeToRehire
//setEmployeeToDelete
//updateEmployeeInfo
//authenticateUser
//getSupervisorInfo
//getEmployeeInfo
//decodeToken
//updateVisitorInfo
//updateSupervisorInfo
//updateAllEmployees
//addMerchItem
//getMerchItem
//updateMerchItem
//

//Reports?