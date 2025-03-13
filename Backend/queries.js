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

//const addVisitor = 'INSERT INTO visitors (VisitorID,FirstName,LastName,Phone,Email,Address,DateOfBirth,AccessibilityNeeds,Gender,Username,Password,Height,Age,MilitaryStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

const getVisitorInfo = 'SELECT * FROM visitors WHERE VisitorID = ?';

const getUnsentNotifications = `
    SELECT ln.notificationID, ln.merchandiseID, m.itemName
    FROM low_stock_notifications ln
    JOIN merchandise m ON ln.merchandiseID = m.merchandiseID
    WHERE ln.sent = 0;
`;

const getSupervisorEmailByDepartment = `
    SELECT email FROM supervisors WHERE departmentName = ?;
`;

const markNotificationAsSent = `
    UPDATE low_stock_notifications
    SET sent = 1
    WHERE notificationID = ?;
`;
const getEmployeesByDepartment = 
'SELECT * FROM employee WHERE Department = ?';


const authenticateVisitor = 'SELECT * FROM visitors WHERE username = ? AND password = ?';

const addVisitor = `
    INSERT INTO visitors (FirstName, LastName, Phone, Email, Address, DateOfBirth, 
        AccessibilityNeeds, Gender, Username, Password, Height, Age, MilitaryStatus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const checkVisitorExists = `
    SELECT * FROM visitors WHERE Username = ?
`;

const purchasePass = 'INSERT INTO tickets (ticketType, price, VisitorID, purchaseDate) VALUES (?,?,?,NOW())';

const getEmployeesByDepartment = `
    SELECT * FROM employee WHERE Department = ?
`;

const getMaintenanceRequests = `
    SELECT * FROM maintenance WHERE MaintenanceStatus = 0
`;

const updateMaintenanceStatus = `
    UPDATE maintenance SET MaintenanceStatus = ? WHERE MaintenanceID = ?
`;

const getLowStockMerchandise = `
    SELECT * FROM merchandise WHERE quantity < 10
`;

const getSalesReport = `
    SELECT * FROM merchandiseTransactions
`;

const getTicketSales = `
    SELECT * FROM tickets
`;

const getVisitorRecords = `
    SELECT * FROM visitors
`;


module.exports = {
    getRides,
    getEmployees,
    addEmployee,
    getRidesNeedingMaintenance,
    addMaintenance,
    getMerchandiseTransactions,
    addMerchandiseTransaction,
    addRestaurant,
    getMealPlans,
    getRestaurantTransactions,
    addRestaurantTransaction,
    getSupervisors,
    getSupervisorIDbyDept,
    updateEmployeeForDeletion,
    updateEmployeeForRehire,
    updateEmployeeInfo,
    getEmployeeInfo,
    addVisitor,
    getVisitorInfo,
    getUnsentNotifications,
    getSupervisorEmailByDepartment,
    markNotificationAsSent,
    authenticateVisitor,
    checkVisitorExists,
    purchasePass,
    getEmployeesByDepartment,
    getMaintenanceRequests,
    updateMaintenanceStatus,
    getLowStockMerchandise,
    getSalesReport,
    getTicketSales,
    getVisitorRecords
};

//checkMerchQuantity
//getSupervisorEmailByDepartment
//updateMerchQuantity
//getTickets
//addTickets
//getTicketTransactions
//getAllVisitors
//addVisitors
//getDisabledVisitors
//getWeather
//getInclementWeather
//getDaysClosedForWeather
//addDayClosedForWeather
//addRides
//authenticateUser
//getSupervisorInfo
//decodeToken
//updateVisitorInfo
//updateSupervisorInfo
//updateAllEmployees
//addMerchItem
//getMerchItem
//updateMerchItem
//markItemForDeletion
//sendMaintenanceMessage
//updateMerchItemQuantity
//getMerchItemQuantity
//getEmployeeDepartment
//getSupervisorDepartment
//orderMoreMerch ????
//getEventList
//addEventToList
//markEventForCancellation
//updateEvent

//Reports?