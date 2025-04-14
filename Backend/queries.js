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
        rm.maintenanceID,
        r.RideName,
        CONCAT(e.FirstName, ' ', e.LastName) AS AssignedEmployee,
        rm.status,
        rm.reason,
        DATE(rm.MaintenanceStartDate) AS StartDate,
        DATE(rm.MaintenanceEndDate) AS EndDate,
        IFNULL(TIMESTAMPDIFF(DAY, rm.MaintenanceStartDate, rm.MaintenanceEndDate), 0) AS DaysTaken
    FROM ridemaintenance rm
    JOIN rides r ON rm.rideID = r.RideID
    LEFT JOIN employee e ON rm.MaintenanceEmployeeID = e.EmployeeID
    WHERE 
        rm.MaintenanceStartDate >= ? AND
        rm.MaintenanceEndDate <= ? AND
        (? = 0 OR rm.rideID = ?)
    ORDER BY rm.MaintenanceStartDate DESC;
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
        oh.dateOH,
        COALESCE(SUM(tt.totalAmount), 0) AS TicketRevenue,
        COALESCE(SUM(mt.price), 0) AS MealPlanRevenue,
        COALESCE(SUM(rt.amount), 0) AS FoodRevenue,
        (COALESCE(SUM(tt.totalAmount), 0) + COALESCE(SUM(mt.price), 0) + COALESCE(SUM(rt.amount), 0)) AS TotalRevenue,
        oh.weatherCondition
    FROM operating_hours oh
    LEFT JOIN tickettransactions tt ON DATE(tt.transactionDate) = oh.dateOH
    LEFT JOIN mealplantransactions mt ON DATE(mt.transactionDate) = oh.dateOH
    LEFT JOIN restauranttransactions rt ON DATE(rt.transactionDate) = oh.dateOH
    WHERE 1 = 1
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

const getEvents = `
    SELECT * FROM parkevent ORDER BY event_date
`;

const addEvent = `
    INSERT INTO parkevent (eventName, durationMin, description, event_date, type)
    VALUES (?,?,?,?,?)
`;

const updateEvent = `
    UPDATE parkevent 
    SET eventName = ?, durationMin = ?, description = ?, event_date = ?, type = ? WHERE eventID = ?
`;

const deleteEvent = 'DELETE FROM parkevent WHERE eventID = ?';

const getEmployeeSchedule = `
    SELECT scheduleDate, shiftStart, shiftEnd
    FROM employee_schedule
    WHERE EmployeeID = ? AND scheduleDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 21 DAY)
    ORDER BY scheduleDate
`;

const requestTimeOff = `
    INSERT INTO employee_timeoff_request (EmployeeID, startDate, endDate, reason, status)
    VALUES (?, ?, ?, ?, 'pending')
`;

const clockIn = `
    INSERT INTO employee_attendance (EmployeeID, clockIn, date)
    VALUES (?, NOW(), ?)
    ON DUPLICATE KEY UPDATE clockIn = NOW()
`;

const clockOut = `
    UPDATE employee_attendance
    SET clockOut = NOW()
    WHERE EmployeeID = ? AND date = ?
`;

const getEmployeeProfile = `
    SELECT EmployeeID, FirstName, LastName, Email, Address, Department, dateOfBirth
    FROM employee
    WHERE EmployeeID = ?
`;

const getFilteredEmployees = (conditions) => `
    SELECT 
        e.EmployeeID, e.FirstName, e.LastName, e.Email, e.Address, 
        e.Department, e.username, e.employmentStatus, e.dateOfBirth,
        s.FirstName AS SupervisorFirstName, s.LastName AS SupervisorLastName
    FROM employee e
    LEFT JOIN supervisors s ON e.SupervisorID = s.SupervisorID
    ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
`;

const addEmployeeSchedule = `
    INSERT INTO employee_schedule (EmployeeID, Department, scheduleDate, shiftStart, shiftEnd, isRecurring)
    VALUES (?, ?, ?, ?, ?, ?)
`;

const deleteEmployeeSchedule = `
    DELETE FROM employee_schedule
    WHERE EmployeeID = ? AND scheduleDate = ?
`;

const getSpecificEmployeeSchedule = `
    SELECT scheduleDate 
    FROM employee_schedule 
    WHERE EmployeeID = ?;
`;

const getTimeOffRequests = `
    SELECT r.requestID, r.EmployeeID, e.FirstName, e.LastName, r.startDate, r.endDate, r.reason, r.status
    FROM employee_timeoff_request r
    JOIN employee e ON r.EmployeeID = e.EmployeeID
    ORDER BY r.startDate DESC
`;

const updateTimeOffRequestStatus = `
    UPDATE employee_timeoff_request
    SET status = ?
    WHERE requestID = ?
`;

const updateEmployeeProfile = (fields) => `
    UPDATE employee
    SET ${fields.join(', ')}
    WHERE EmployeeID = ?
`;

const archiveEmployeeData = `
    INSERT INTO archived_employee_data (EmployeeID, FirstName, LastName, Email, Address, username, Department, employmentStatus, dateArchived)
    SELECT EmployeeID, FirstName, LastName, Email, Address, username, Department, employmentStatus, NOW()
    FROM employee
    WHERE EmployeeID = ?
`;

const deleteEmployee = `
    DELETE FROM employee
    WHERE EmployeeID = ?
`;

const salesReport = `
    SELECT
    d.transactionDate,

    -- Total sales
    (
        (SELECT COUNT(*) FROM tickettransactions WHERE DATE(transactionDate) = d.transactionDate) +
        (SELECT COUNT(*) FROM mealplantransactions WHERE DATE(transactionDate) = d.transactionDate) +
        (SELECT COUNT(*) FROM merchandisetransactions WHERE DATE(transactionDate) = d.transactionDate)
    ) AS totalSales,

    -- Total revenue
    (
        IFNULL((
        SELECT SUM(tix.price)
        FROM tickettransactions t2
        JOIN tickets tix ON t2.transactionID = tix.transactionID
        WHERE DATE(t2.transactionDate) = d.transactionDate
        ), 0) +
        IFNULL((
        SELECT SUM(mp.price)
        FROM mealplantransactions m2
        JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
        WHERE DATE(m2.transactionDate) = d.transactionDate
        ), 0) +
        IFNULL((
        SELECT SUM(mt2.totalAmount)
        FROM merchandisetransactions mt2
        WHERE DATE(mt2.transactionDate) = d.transactionDate
        ), 0)
    ) AS totalRevenue,

    -- Average revenue per item
    (
        (
        IFNULL((SELECT SUM(tix.price)
                FROM tickettransactions t2
                JOIN tickets tix ON t2.transactionID = tix.transactionID
                WHERE DATE(t2.transactionDate) = d.transactionDate), 0) +
        IFNULL((SELECT SUM(mp.price)
                FROM mealplantransactions m2
                JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
                WHERE DATE(m2.transactionDate) = d.transactionDate), 0) +
        IFNULL((SELECT SUM(mt2.totalAmount)
                FROM merchandisetransactions mt2
                WHERE DATE(mt2.transactionDate) = d.transactionDate), 0)
        )
        /
        (
        (SELECT COUNT(*) FROM tickettransactions WHERE DATE(transactionDate) = d.transactionDate) +
        (SELECT COUNT(*) FROM mealplantransactions WHERE DATE(transactionDate) = d.transactionDate) +
        (SELECT COUNT(*) FROM merchandisetransactions WHERE DATE(transactionDate) = d.transactionDate)
        )
    ) AS avgRevenuePerItem,

        -- Best-selling ticket type
    IFNULL((
    SELECT t2.ticketType
    FROM tickettransactions t2
    WHERE DATE(t2.transactionDate) = d.transactionDate
    GROUP BY t2.ticketType
    ORDER BY COUNT(*) DESC
    LIMIT 1
    ), 'N/A') AS bestSellingTicket,

    -- Worst-selling ticket type
    IFNULL((
    SELECT t2.ticketType
    FROM tickettransactions t2
    WHERE DATE(t2.transactionDate) = d.transactionDate
    GROUP BY t2.ticketType
    ORDER BY COUNT(*) ASC
    LIMIT 1
    ), 'N/A') AS worstSellingTicket,

    -- Best-selling meal plan
    IFNULL((
    SELECT mp.mealPlanName
    FROM mealplantransactions m2
    JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
    WHERE DATE(m2.transactionDate) = d.transactionDate
    GROUP BY mp.mealPlanName
    ORDER BY COUNT(*) DESC
    LIMIT 1
    ), 'N/A') AS bestSellingMealPlan,

    -- Worst-selling meal plan
    IFNULL((
    SELECT mp.mealPlanName
    FROM mealplantransactions m2
    JOIN mealplans mp ON m2.mealPlanID = mp.mealPlanID
    WHERE DATE(m2.transactionDate) = d.transactionDate
    GROUP BY mp.mealPlanName
    ORDER BY COUNT(*) ASC
    LIMIT 1
    ), 'N/A') AS worstSellingMealPlan,

    -- Best-selling merch
    IFNULL((
    SELECT m.itemName
    FROM merchandisetransactions mt2
    JOIN merchandise m ON mt2.merchandiseID = m.merchandiseID
    WHERE DATE(mt2.transactionDate) = d.transactionDate
    GROUP BY m.itemName
    ORDER BY COUNT(*) DESC
    LIMIT 1
    ), 'N/A') AS bestSellingMerch,

    -- Worst-selling merch
    IFNULL((
    SELECT m.itemName
    FROM merchandisetransactions mt2
    JOIN merchandise m ON mt2.merchandiseID = m.merchandiseID
    WHERE DATE(mt2.transactionDate) = d.transactionDate
    GROUP BY m.itemName
    ORDER BY COUNT(*) ASC
    LIMIT 1
    ), 'N/A') AS worstSellingMerch

    FROM (
    SELECT DISTINCT DATE(transactionDate) AS transactionDate
    FROM (
        SELECT transactionDate FROM tickettransactions
        UNION ALL
        SELECT transactionDate FROM mealplantransactions
        UNION ALL
        SELECT transactionDate FROM merchandisetransactions
    ) AS combined
    WHERE DATE(transactionDate) BETWEEN ? AND ?
    ) d
    ORDER BY d.transactionDate;
`;

const getTransactionSummaryReport = `
    SELECT DATE(transactionDate) AS transactionDate, 'ticket' AS transactionType, SUM(tix.price) AS totalRevenue
    FROM tickettransactions t
    JOIN tickets tix ON t.transactionID = tix.transactionID
    WHERE DATE(transactionDate) BETWEEN ? AND ?
    GROUP BY DATE(transactionDate)

    UNION ALL

    SELECT DATE(transactionDate) AS transactionDate, 'mealplan' AS transactionType, SUM(mp.price) AS totalRevenue
    FROM mealplantransactions m
    JOIN mealplans mp ON m.mealPlanID = mp.mealPlanID
    WHERE DATE(transactionDate) BETWEEN ? AND ?
    GROUP BY DATE(transactionDate)

    UNION ALL

    SELECT DATE(transactionDate) AS transactionDate, 'merch' AS transactionType, SUM(totalAmount) AS totalRevenue
    FROM merchandisetransactions
    WHERE DATE(transactionDate) BETWEEN ? AND ?
    GROUP BY DATE(transactionDate)

    ORDER BY transactionDate;
`;

const getEmployeeNames = `
    SELECT DISTINCT e.EmployeeID, CONCAT(e.FirstName, ' ', e.LastName) AS FullName
    FROM employee e
    LEFT JOIN employee_schedule es ON es.EmployeeID = e.EmployeeID;
`;

const getAllEmployees = `
    SELECT EmployeeID, FirstName, LastName FROM employee
`;

const getEmployeeScheduleForSup  = `
    SELECT * FROM employee_schedule;
`;

const getSchedulesWithNames = `
    SELECT 
        e.EmployeeID, 
        CONCAT(e.FirstName, ' ', e.LastName) AS FullName, 
        es.scheduleDate
    FROM employee_schedule es
    JOIN employee e ON es.EmployeeID = e.EmployeeID;
`;

const maintenanceEmployeePerformanceReport = `
    SELECT 
        e.EmployeeID,
        CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
        COUNT(IF(rm.maintenanceID IS NOT NULL, 1, NULL)) AS TotalTasks,
        IFNULL(SUM(CASE WHEN rm.status = 'completed' THEN 1 ELSE 0 END), 0) AS CompletedTasks,
        IFNULL(ROUND(AVG(
            CASE 
                WHEN rm.status = 'completed' 
                AND rm.MaintenanceStartDate IS NOT NULL 
                AND rm.MaintenanceEndDate IS NOT NULL
                THEN TIMESTAMPDIFF(DAY, rm.MaintenanceStartDate, rm.MaintenanceEndDate)
                ELSE NULL
            END
        ), 2), 0) AS AvgDaysToComplete
    FROM employee e
    LEFT JOIN ridemaintenance rm ON e.EmployeeID = rm.MaintenanceEmployeeID
    WHERE
        e.Department = 'maintenance' AND
        (? = 0 OR e.EmployeeID = ?)
    GROUP BY e.EmployeeID
    ORDER BY TotalTasks DESC;
`;

const getDepartmentByEmployeeID = `
    SELECT Department FROM employee WHERE EmployeeID = ?
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
    getMealPlanPrice,
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEmployeeSchedule,
    requestTimeOff,
    clockIn,
    clockOut,
    getEmployeeProfile,
    getFilteredEmployees,
    addEmployeeSchedule,
    deleteEmployeeSchedule,
    getTimeOffRequests,
    updateTimeOffRequestStatus,
    updateEmployeeProfile,
    archiveEmployeeData,
    salesReport,
    getEmployeeNames,
    getEmployeeScheduleForSup,
    getSpecificEmployeeSchedule,
    getSchedulesWithNames,
    getTransactionSummaryReport,
    maintenanceEmployeePerformanceReport,
    getAllEmployees,
    getDepartmentByEmployeeID
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