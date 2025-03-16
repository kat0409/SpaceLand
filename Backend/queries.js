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

const authenticateVisitor = 'SELECT * FROM visitors WHERE username = ? AND password = ?';

const authenticateEmployee = 'SELECT * FROM employee WHERE username = ? AND password = ?';

const authenticateSupervisor = 'SELECT * FROM supervisors WHERE username = ? AND password = ?';

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
const lowStockMerchandiseReport = `
    SELECT 
        m.itemName AS Merchandise_Item,
        m.quantity AS Remaining_Stock,
        s.email AS Supervisor_Email,
        ln.timestamp AS Notification_Date
    FROM 
        lowstocknotifications ln
    JOIN 
        merchandise m ON ln.merchandiseID = m.merchandiseID
    JOIN 
        supervisors s ON ln.supervisorID = s.SupervisorID
    WHERE 
        ln.sent = FALSE;
`;

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
        t.ticketType AS Ticket_Type,
        tt.quantity AS Ticket_Quantity,
        tt.totalAmount AS Ticket_Total_Spent,
        m.itemName AS Merchandise_Bought,
        mt.quantity AS Merchandise_Quantity,
        mt.totalAmount AS Merchandise_Total_Spent
    FROM 
        visitors v
    LEFT JOIN 
        tickets t ON v.VisitorID = t.VisitorID
    LEFT JOIN 
        tickettransactions tt ON t.ticketID = tt.ticketID
    LEFT JOIN 
        merchandisetransactions mt ON v.VisitorID = mt.VisitorID
    LEFT JOIN 
        merchandise m ON mt.merchandiseID = m.merchandiseID;
`;

const attendanceAndRevenueReport = `
    SELECT 
        oh.date AS Operating_Date,
        COUNT(t.ticketID) AS Tickets_Sold,
        SUM(tt.totalAmount) AS Total_Ticket_Revenue,
        oh.weatherCondition AS Weather_Condition
    FROM 
        operating_hours oh
    JOIN 
        tickets t ON oh.ticketID = t.ticketID
    JOIN 
        tickettransactions tt ON t.ticketID = tt.ticketID
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
    e.employmentStatus, e.dateOfBirth
    FROM employee e
    WHERE e.username = ? AND e.password = ?;
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
const deleteEmployee = `
    DELETE FROM employee WHERE employmentStatus == 0 AND EmployeeID = ?
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
    getLowStockMerchandise,
    getSalesReport,
    getTicketSales,
    getVisitorRecords,
    updateMaintenanceDates,
    updateRideMaintenanceStatus,
    authenticateEmployee,
    lowStockMerchandiseReport,
    rideMaintenanceReport,
    visitorPurchasesReport,
    attendanceAndRevenueReport,
    getVisitorAccountInfo,
    getEmployeeAccountInfo,
    getSupervisorAccountInfo,
    addRide,
    authenticateSupervisor,
    checkRideExists
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