//Make any query you can think of an store it here

const getRides = 'SELECT * FROM rides';

const getEmployees = 'SELECT * FROM employee';

const addEmployee = 'INSERT INTO employee (FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus, dateOfBirth) VALUES (?,?,?,?,?,?,?,?,?,?)';

const getRidesNeedingMaintenance = 'SELECT * FROM rides WHERE MaintenanceNeed = 1';

const addMaintenance = 'INSERT INTO maintenance (RideID, MaintenanceStartDate, MaintenanceEndDate, MaintenanceEmployeeID, eventID) VALUES (?,?,?,?,?,)';

const getMerchandiseTransactions = 'SELECT * FROM merchandiseTransactions';

const addMerchandiseTransaction = 'INSERT INTO merchandiseTransactions (merchandiseID, VisitorID, transactionDate, quantity, totalAmount) VALUES (?,?,?,?,?)';

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

const authenticateVisitor = 'SELECT VisitorID FROM visitors WHERE username = ? AND password = ?';

const authenticateEmployee = 'SELECT EmployeeID  FROM employee WHERE username = ? AND password = ?';

const authenticateSupervisor = 'SELECT SupervisorID FROM supervisors WHERE username = ? AND password = ?';

const addVisitor = `
    INSERT INTO visitors (FirstName, LastName, Phone, Email, Address, DateOfBirth, 
        AccessibilityNeeds, Gender, Username, Password, Height, Age, MilitaryStatus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const checkVisitorExists = `
    SELECT * FROM visitors WHERE Username = ?
`;


//not yet in ui
// Insert a new transaction
const createTransaction = `
    INSERT INTO tickettransactions (VisitorID, transactionDate, quantity, totalAmount, ticketType) 
    VALUES (?, NOW(), ?, ?, ?)
`;

// Insert actual tickets (one per quantity purchased)
const insertTickets = `
    INSERT INTO tickets (price, purchaseDate, transactionID, ticketType) 
    VALUES ?
`;

const getEmployeesByDepartment = `
    SELECT * FROM employee WHERE Department = ?
`;

const getMaintenanceRequests = `
    SELECT * FROM rides WHERE MaintenanceNeed = 1
`;

const updateRideMaintenanceStatus = `
    UPDATE rides 
    SET MaintenanceStatus = ? 
    WHERE RideID = (SELECT RideID FROM maintenance WHERE MaintenanceID = ?)
`;

const updateMaintenanceDates = `
    UPDATE maintenance 
    SET MaintenanceStartDate = ?, MaintenanceEndDate = ? 
    WHERE MaintenanceID = ?
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

const addRide = `
    INSERT INTO rides (RideID, RideName, MinHeight, MaxWeight,Capacity,Duration,MaintenanceStatus, MaintenanceNeed)
    VALUES (?,?,?,?,?,?,?,?)
`;

const checkRideExists = `SELECT * FROM rides WHERE RideName = ?`;

//Reports
const rideMaintenanceReport = `
    SELECT 
        r.RideName AS Ride,
        m.MaintenanceStartDate AS Start_Date,
        m.MaintenanceEndDate AS End_Date,
        CONCAT(e.FirstName, ' ', e.LastName) AS Maintenance_Employee
    FROM 
        maintenance m
    JOIN 
        rides r ON m.RideID = r.RideID
    JOIN 
        employee e ON m.MaintenanceEmployeeID = e.EmployeeID;
`;

const visitorPurchasesReport = `
    SELECT 
        v.VisitorID,
        CONCAT(v.FirstName, ' ', v.LastName) AS Visitor_Name,
        COALESCE(tt.ticketType, 'No Ticket Purchased') AS Ticket_Type,
        COALESCE(tt.quantity, 0) AS Ticket_Quantity,
        COALESCE(tt.totalAmount, 0.00) AS Ticket_Total_Spent,
        COALESCE(m.itemName, 'No Merchandise Bought') AS Merchandise_Bought,
        COALESCE(mt.quantity, 0) AS Merchandise_Quantity,
        COALESCE(mt.totalAmount, 0.00) AS Merchandise_Total_Spent
    FROM 
        visitors v
    LEFT JOIN 
        tickettransactions tt ON v.VisitorID = tt.VisitorID
    LEFT JOIN 
        tickets t ON tt.transactionID = t.transactionID
    LEFT JOIN 
        merchandisetransactions mt ON v.VisitorID = mt.VisitorID
    LEFT JOIN 
        merchandise m ON mt.merchandiseID = m.merchandiseID;

`;

const attendanceAndRevenueReport = `
    SELECT 
        oh.date AS Operating_Date,
        COUNT(DISTINCT t.ticketID) AS Tickets_Sold,
        COALESCE(SUM(tt.totalAmount), 0) AS Total_Ticket_Revenue,
        oh.weatherCondition AS Weather_Condition
    FROM 
        operating_hours oh
    LEFT JOIN 
        tickets t ON oh.ticketID = t.ticketID 
    LEFT JOIN 
        tickettransactions tt ON t.transactionID = tt.transactionID 
    GROUP BY 
        oh.date, oh.weatherCondition
    ORDER BY 
        oh.date DESC;

`;

const getVisitorAccountInfo = `
    SELECT v.FirstName, v.LastName, v.Phone,
    v.Email, v.Address, v.DateOfBirth, v.AccessibilityNeeds,
    v.Gender, v.Height, v.Age, v.MilitaryStatus
    FROM visitors v
    WHERE v.Username = ? AND v.Password = ?;
`;

const getEmployeeAccountInfo = `
    SELECT e.FirstName, e.LastName, e.EmployeeID, e.Email,
    e.Address, e.SupervisorID, e.Department,
    e.employmentStatus
    FROM employee e
    WHERE e.EmployeeID = ?;
`;

const getSupervisorAccountInfo = `
    SELECT s.FirstName, s.LastName, s.SupervisorID, s.email,
    s.address, s.departmentName,
    s.gender, s.dateOfBirth, s.phoneNumber
    FROM supervisors s
    WHERE s.username = ? AND s.password = ?;
`;

const updateMealPlan = `
    UPDATE restaurant
    SET mealPlanTier = ?, price = ?
    WHERE restaurantID = ?
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
    getEmployeesByDepartment,
    getMaintenanceRequests,
    getLowStockMerchandise,
    getSalesReport,
    getTicketSales,
    getVisitorRecords,
    updateMaintenanceDates,
    updateRideMaintenanceStatus,
    authenticateEmployee,
    rideMaintenanceReport,
    visitorPurchasesReport,
    attendanceAndRevenueReport,
    getVisitorAccountInfo,
    getEmployeeAccountInfo,
    getSupervisorAccountInfo,
    addRide,
    authenticateSupervisor,
    checkRideExists,
    createTransaction,
    insertTickets
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