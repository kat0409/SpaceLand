const express = require('express');
const http = require('http');
const url = require('url');
const cors = require('cors');
const eRoutes = require('./routes');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// Create Express app
const app = express();

// Apply middlewares
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define your route handlers
const routeMap = {
    'GET': [
        '/rides', 
        '/supervisor/HR/employees', 
        '/merchandise', 
        '/maintenance', 
        '/merchandise-transactions', 
        '/supervisor/employees',
        '/supervisor/maintenance-requests',
        '/supervisor/merchandise/low-stock',
        '/supervisor/sales-report',
        '/supervisor/merchandise/ticket-sales',
        '/supervisor/HR/visitors',
        '/supervisor/merchandise/visitor-purchases',
        '/supervisor/maintenance/ride-maintenance',
        '/supervisor/HR/attendance-revenue',
        '/employee/account-info',
        '/supervisor/account-info',
        '/account-info',
        '/supervisor/merchandise/notifications',
        '/supervisor/merchandise/items',
        '/supervisor/merchandise/pending-orders',
        '/supervisor/merchandise/merch',
        '/supervisor/merchandise/orders',
        '/supervisor/maintenance/rides',
        '/supervisor/maintenance/employee-maintenance-request',
        '/supervisor/maintenance/ridemaintenance-pending',
        '/supervisor/maintenance/get-maintenance-requests',
        '/purchase-history',
        '/ticket-history',
        '/alerts',
        '/supervisor/HR/get-supervisors',
        '/supervisor/HR/get-departments',
        '/get-events',
        '/employee/get-schedule',
        '/employee/profile',
        '/supervisor/HR/get-employees-params',
        '/supervisor/HR/time-off-request',
        '/supervisor/merchandise/sales-report',
        '/supervisor/HR/employee-names',
        '/supervisor/HR/get-schedule',
        '/supervisor/HR/get-specific-schedule',
        '/supervisor/HR/shifts-with-names',
        '/supervisor/merchandise/transaction-summary',
        '/supervisor/merchandise/best-worst',
        '/supervisor/maintenance/employee-performance',
        '/supervisor/HR/all-employee-names',
        '/supervisor/HR/get-employee-department',
        '/supervisor/HR/attendance-report',
        "/get-merchandise"
    ],
    'POST': [
        '/supervisor/HR/add-employee', 
        '/add-merchandise-transaction',
        '/login',
        '/add-visitor',
        '/check-visitor',
        '/purchase-cosmic-pass',
        '/purchase-general-pass',
        '/supervisor/update-maintenance-status',
        '/supervisor/add-ride',
        '/supervisor/login',
        '/employee-login',
        '/supervisor/maintenance/insert-ride-maintenance',
        '/supervisor/maintenance/update-ride-maintenance-status',
        '/supervisor/merchandise/reorders',
        '/supervisor/merchandise/stock-arrivals',
        '/supervisor/merchandise/add-merch',
        '/supervisor/maintenance/maintenance-request',
        '/meal-plan-purchase',
        '/supervisor/HR/add-events',
        '/employee/time-off-request',
        '/employee/clock-in',
        '/employee/clock-out',
        '/supervisor/HR/schedule',
        '/supervisor/HR/fire-employee'
    ],
    'PUT': [
        '/update-employee', 
        '/update-merchandise-quantity', 
        '/update-maintenance',
        '/supervisor/update-meal-plan',//make
        '/supervisor/update-employee-info',//make
        '/supervisor/update-visitor-info',//make
        '/supervisor/update-operating-hours',//make
        '/supervisor/update-event-date',//make
        '/supervisor/maintenance/complete-request',
        '/supervisor/HR/update-event',
        '/employee/clock-out',
        '/supervisor/HR/update-time-off-request',
        '/supervisor/HR/update-employee-profile',
        '/supervisor/merchandise/update-item'
    ],
    'DELETE': [
        '/supervisor/delete-employee',
        '/supervisor/delete-maintenance', 
        '/supervisor/delete-item',//make
        '/supervisor/delete-meal-plan',//make
        '/supervisor/delete-ride',//make
        '/supervisor/HR/delete-event',
        '/supervisor/HR/schedule-delete'
    ],
};

// Handle routes
app.all('*', (req, res) => {
    const pathname = req.path;
    const method = req.method;

    if (pathname === '/') {
        res.json("From backend side");
        return;
    }

    const isMatch = (routeMap[method] || []).some(route =>
        pathname.startsWith(route)
    );

    if (isMatch) {
        return eRoutes(req, res);
    }

    res.status(404).json({ error: "Route not found" });
});

// Set port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});