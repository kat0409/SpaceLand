//Make any query you can think of an store it here

const getRides = 'SELECT * FROM rides';

const getEmployees = 'SELECT * FROM employee';

const addEmployee = 'INSERT INTO employee (FirstName, LastName, JobRole, Email, Address, SupervisorID, username, password) VALUES (?,?,?,?,?,?,?,?)';

const getRidesNeedingMaintenance = 'SELECT * FROM rides WHERE MaintenanceNeed = 1';

const addMaintenance = 'INSERT INTO maintenance (RideID, MaintenanceStartDate, MaintenanceEndDate, MaintenanceEmployeeID, eventID) VALUES (?,?,?,?,?,)';

const getMerchandiseTransactions = 'SELECT * FROM merchandiseTransactions';

const addMerchandiseTransaction = 'INSERT INTO merchandiseTransactions (VisitorID, transactionDate, quantity, totalAmount) VALUES (?,?,?,?)';

const addRestaurant = 'INSERT INTO restaurant (restaurantName, mealPlanTier) VALUES (?,?)';

//getRestaurant
//getRestaurantTransactions
//getTickets
//addTickets
//getTicketTransactions

//Reports?