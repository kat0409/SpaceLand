//Make any query you can think of an store it here

const getRides = 'SELECT * FROM rides';

const getEmployees = 'SELECT * FROM employee';

const addEmployee = 'INSERT INTO employee (FirstName, LastName, Email, Address, SupervisorID, username, password, Department, employmentStatus, dateOfBirth) VALUES (?,?,?,?,?,?,?,?,?,?)';

const getRidesNeedingMaintenance = 'SELECT * FROM rides WHERE MaintenanceNeed = 1';

const getMerchandiseTransactions = 'SELECT * FROM merchandiseTransactions';

const addMerchandiseTransaction = 'INSERT INTO merchandiseTransactions (merchandiseID, VisitorID, transactionDate, quantity, totalAmount) VALUES (?,?,?,?,?)';

const addRestaurant = 'INSERT INTO restaurant (restaurantName, mealPlanTier) VALUES (?,?)';

const getMealPlans = 'SELECT * FROM restaurant';

const getRestaurantTransactions = 'SELECT * FROM restaurantTransactions';

const addRestaurantTransaction = 'INSERT INTO restaurantTransactions (restaurantID, VisitorID, transactionDate, Amount) VALUES (?, ?, ?, ?)';

const getSupervisors = 'SELECT * FROM supervisors';

const getSupervisorIDbyDept = 'SELECT SupervisorID FROM supervisors WHERE departmentName = ?';

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

const authenticateSupervisor = `SELECT SupervisorID, departmentIDNumber, departmentName FROM supervisors WHERE username = ? AND password = ?`;

const sendLowStockNotifications =  `SELECT * FROM lowstocknotifications 
    WHERE supervisorID = ? AND isRead = 0 ORDER BY messsageTime DESC
`;

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

/*const updateRideMaintenanceStatus = `
    UPDATE rides 
    SET MaintenanceStatus = ? 
    WHERE RideID = (SELECT RideID FROM maintenance WHERE MaintenanceID = ?)
`;

const updateMaintenanceDates = `
    UPDATE maintenance 
    SET MaintenanceStartDate = ?, MaintenanceEndDate = ? 
    WHERE MaintenanceID = ?
`;*/

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

const insertRideMaintenance = `INSERT INTO rideMaintenance (rideID,status,reason,createdAT,MaintenanceEndDate,MaintenanceEmployeeID,MaintenanceStartDate) VALUES (?,?,?,NOW(),?,?,?)`;

const completedRideMaintenance = `
    UPDATE rideMaintenance
    SET status = 'completed'
    WHERE maintenanceID = (
    SELECT maintenanceID FROM (
        SELECT maintenanceID
        FROM rideMaintenance
        WHERE rideID = ? AND status IN ('pending', 'in_progress')
        ORDER BY createdAt DESC
        LIMIT 1
    ) AS subquery
    );
`;

const removeHomePageAlert = `
    UPDATE homepagealerts
    SET isResolved = 1
    WHERE rideID = ? AND isResolved = 0;
`;

const reorderMerchandise = `
    INSERT INTO merchandiseReorders (merchandiseID,quantityOrdered,
    expectedArrivalDate,status,notes)
    VALUES (?,?,?,?,?)
`;

const getMerchList = `
    SELECT merchandiseID, itemName FROM merchandise ORDER BY itemName;
`;

const markStockArrivals = `
    INSERT INTO stockArrivals (merchandiseID,quantityAdded,arrivalDate,
    notes,reorderID)
    VALUES (?,?,?,?,?)
`;

const getPendingOrders = `
    SELECT r.reorderID, r.merchandiseID, r.quantityOrdered, r.expectedArrivalDate, m.itemName
    FROM merchandisereorders r
    JOIN merchandise m ON r.merchandiseID = m.merchandiseID
    WHERE r.status = 'pending'
`;

const getMerchandiseTable = `
    SELECT * FROM merchandise
`;

const getMerchandiseReordersTable =`
    SELECT r.reorderID, r.quantityOrdered, r.expectedArrivalDate, r.status, r.notes, m.itemName
    FROM merchandisereorders r
    JOIN merchandise m ON r.merchandiseID = m.merchandiseID
`;

const addMerchandise = `
    INSERT INTO merchandise (itemName, price, quantity, giftShopName, departmentNumber)
    Values (?,?,?,?,?)
`;


//Reports
const rideMaintenanceReport = `
    SELECT 
        r.RideName AS Ride,
        m.MaintenanceStartDate AS Start_Date,
        m.MaintenanceEndDate AS End_Date,
        CONCAT(e.FirstName, ' ', e.LastName) AS Maintenance_Employee,
        m.status AS Status,
        m.reason AS Reason
    FROM 
        ridemaintenance m
    JOIN 
        rides r ON m.rideID = r.RideID
    LEFT JOIN 
        employee e ON m.MaintenanceEmployeeID = e.EmployeeID
    ORDER BY 
        m.MaintenanceStartDate DESC;
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
        merchandise m ON mt.merchandiseID = m.merchandiseID
    WHERE 1=1
`;
//check the WHERE 1=1 during debugging

const attendanceAndRevenueReport = `
    SELECT 
        oh.dateOH AS Operating_Date,
        COUNT(DISTINCT t.ticketID) AS Tickets_Sold,
        COALESCE(SUM(tt.totalAmount), 0) AS Total_Ticket_Revenue,
        oh.weatherCondition AS Weather_Condition
    FROM 
        operating_hours oh
    LEFT JOIN 
        tickets t ON oh.ticketID = t.ticketID 
    LEFT JOIN 
        tickettransactions tt ON t.transactionID = tt.transactionID 
    WHERE 1=1
`;

/*GROUP BY 
oh.dateOH, oh.weatherCondition
ORDER BY 
oh.dateOH DESC*/

const getVisitorAccountInfo = `
    SELECT v.FirstName, v.LastName, v.Phone,
    v.Email, v.Address, v.DateOfBirth, v.AccessibilityNeeds,
    v.Gender, v.Height, v.Age, v.MilitaryStatus
    FROM visitors v
    WHERE v.VisitorID = ?;
`;

const getVisitorMerchPurchases = `
    SELECT
        mt.transactionDate,
        m.itemName,
        m.giftShopName,
        mt.quantity,
        m.price,
        mt.totalAmount
    FROM merchandisetransactions mt
    JOIN merchandise m ON mt.merchandiseID = m.merchandiseID
    WHERE mt.VisitorID = ?
`;

const getVisitorTicketTransactions = `
    SELECT
        tt.transactionDate,
        tt.ticketType,
        tt.quantity,
        tt.totalAmount
    FROM tickettransactions tt
    WHERE tt.VisitorID = ?;
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

const updateEmployeeForDeletion = 'UPDATE employee SET employmentStatus = 0 WHERE EmployeeID = ?';

const updateEmployeeForRehire = 'UPDATE employee SET employmentStatus = 1 WHERE EmployeeID = ?';

const updateEmployeeInfo = `
    UPDATE employee 
    SET FirstName = ?, LastName = ?, Email = ?, 
    Address = ?, username = ?, password = ?
    WHERE employeeID = ?`;

const updateMealPlan = `
    UPDATE restaurant
    SET mealPlanTier = ?, price = ?
    WHERE restaurantID = ?;
`;
const deleteEmployee = `
    DELETE FROM employee WHERE employmentStatus == 0 AND EmployeeID = ?;
`;

const updateOperatingHours = `
    UPDATE operating_hours
    SET dateOH = ?, openingTime = ?, closingTime = ?
    WHERE operatingHoursID = ?;
`;

const updateVisitorInfo = `
    UPDATE vistors as v
    SET v.FirstName = ?, v.LastName = ?, v.Phone = ?, v.Email = ?, v.Address = ?, v.AccessibilityNeeds = ?, v.Gender = ?, v.MilitaryStatus = ?
    WHERE v.VisitorID = ? AND v.Username = ? AND v.Password = ?;
`;

const addMaintenanceRequest = `
    INSERT INTO ridemaintenance (rideID, status, reason, MaintenanceEndDate, MaintenanceEmployeeID, MaintenanceStartDate)
    VALUES (?,?,?,?,?,?)
`;

const getMaintenanceEmployeesForMR = `
    SELECT EmployeeID, FirstName, LastName
    FROM employee
    WHERE Department = 'Maintenance' AND employmentStatus = 1
`;

const getRidesForMaintenanceRequest = `
    SELECT RideID, RideName
    FROM Rides
`;

const completeMaintenanceRequest = `
    UPDATE rideMaintenance
    SET status = 'completed', MaintenanceEndDate = ?
    WHERE maintenanceID = ?
`;

const getPendingMaintenance = `
    SELECT r.maintenanceID, r.rideID, rd.RideName, r.status, r.reason, r.MaintenanceStartDate, r.MaintenanceEndDate,
        r.MaintenanceEmployeeID, e.FirstName, e.LastName
    FROM ridemaintenance r
    JOIN rides rd ON r.rideID = rd.RideID
    LEFT JOIN employee e ON r.MaintenanceEmployeeID = e.EmployeeID
    WHERE r.status IN ('pending');
`;

const getMaintenanceRequests = `
    SELECT r.RideName, rm.rideID, rm.status, rm.reason, rm.MaintenanceStartDate, rm.MaintenanceEndDate, rm.MaintenanceEmployeeID
    FROM rideMaintenance rm
    JOIN rides r ON r.RideID = rm.rideID
`;

const getHomePageAlerts = `
    SELECT a.alertID, a.alertMessage, a.timestamp, r.RideName
    FROM homepagealerts a
    JOIN rides r ON a.rideID = r.RideID
    WHERE a.isResolved = 0
    ORDER BY a.timestamp DESC
`;

const getSupervisorNames = `
    SELECT s.SupervisorID, s.FirstName, s.LastName
    FROM supervisors s
`;

const getDepartmentNames = `
    SELECT DISTINCT s.departmentIDNumber, s.DepartmentName
    From supervisors s
`;

const addMealPlanTransaction = `
    INSERT INTO mealPlanTransactions(mealPlanID, VisitorID,transactionDate,price)
    VALUES(?,?,?,?)
`;

const getMealPlanPrice = `
    SELECT price
    FROM mealPlans
    WHERE mealPlanID = ?
`;

module.exports = {
    getRides,
    getEmployees,
    addEmployee,
    getRidesNeedingMaintenance,
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
    insertTickets,
    sendLowStockNotifications,
    insertRideMaintenance,
    completedRideMaintenance,
    removeHomePageAlert,
    deleteEmployee,
    updateMealPlan,
    updateOperatingHours,
    updateVisitorInfo,
    reorderMerchandise,
    getMerchList,
    markStockArrivals,
    getPendingOrders,
    getMerchandiseTable,
    getMerchandiseReordersTable,
    addMerchandise,
    addMaintenanceRequest,
    getRidesForMaintenanceRequest,
    getMaintenanceEmployeesForMR,
    completeMaintenanceRequest,
    getPendingMaintenance,
    getVisitorMerchPurchases,
    getVisitorTicketTransactions,
    getHomePageAlerts,
    getSupervisorNames,
    getDepartmentNames,
    addMealPlanTransaction,
    getMealPlanPrice
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