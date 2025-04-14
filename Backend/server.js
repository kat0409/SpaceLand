const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const eRoutes = require('./routes');

// Create Express app
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// Apply middlewares
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define your route maps (just for reference, not used for actual routing)
const routeMap = {
    'GET': [
        '/rides', 
        '/supervisor/HR/employees',
        // ...other GET routes
    ],
    'POST': [
        '/supervisor/HR/add-employee',
        // ...other POST routes
    ],
    'PUT': [
        '/update-employee',
        // ...other PUT routes
    ],
    'DELETE': [
        '/supervisor/delete-employee',
        // ...other DELETE routes
    ]
};

// Simple test endpoint
app.get('/test-upload', (req, res) => {
    res.send(`
        <html><body>
            <h1>Upload Test</h1>
            <form action="/supervisor/merchandise/update-item" method="post" enctype="multipart/form-data">
                <input type="hidden" name="merchandiseID" value="10" />
                <input type="hidden" name="itemName" value="Test Item" />
                <input type="hidden" name="price" value="9.99" />
                <input type="hidden" name="quantity" value="5" />
                <input type="file" name="image" />
                <button type="submit">Upload</button>
            </form>
        </body></html>
    `);
});

// Root endpoint
app.get('/', (req, res) => {
    res.json("From backend side");
});

// Pass all other requests to eRoutes
app.use((req, res) => {
    const pathname = req.path;
    const method = req.method;
    
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