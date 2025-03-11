//Make any query you can think of an store it here

const getRides = 'SELECT * FROM rides';

const getEmployees = 'SELECT * FROM employee';

const addEmployee = 'INSERT INTO employee (FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus, dateOfBirth) VALUES (?,?,?,?,?,?,?,?,?,?)';

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

const updateEmployeeInfo = 'UPDATE employee SET FirstName = ?, LastName = ?, Email = ?, Address = ?, SupervisorID = ?, username = ?, password = ?, Department = ?, employmentStatus = ?, dateOfBirth = ?';

const getEmployeeInfo = 'SELECT * FROM employee WHERE EmployeeID = ?';

const addVisitor = 'INSERT INTO visitors (VisitorID,FirstName,LastName,Phone,Email,Address,DateOfBirth,AccessibilityNeeds,Gender,Username,Password,Height,Age,MilitaryStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

const getVisitorInfo = 'SELECT * FROM visitors WHERE VisitorID = ?';

//getRestaurantTransactions
//getTickets
//addTickets
//getTicketTransactions
//getVisitors
//getAllVisitors
//getDisabledVisitors
//getWeather
//getInclementWeather
//getDaysClosedForWeather
//addDayClosedForWeather

//authenticateUser
//getSupervisorInfo
//decodeToken
//updateVisitorInfo
//updateSupervisorInfo
//updateAllEmployees
//addMerchItem
//getMerchItem
//updateMerchItem
//

//Reports?