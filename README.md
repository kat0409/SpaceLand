# 🚀 SpaceLand Theme Park Management System

# Created By
Kathiana Rodriguez, Mark Pelico, Celeste Cabrales

## Project Overview
This web application is a comprehensive management system for SpaceLand, a space-themed amusement park. The system handles various aspects of park operations including visitor management, employee scheduling, ride maintenance, merchandise inventory, and reporting functionalities for different supervisor roles.

## 📋 Database Details
The database uses MySQL and includes the following key entities:
- **Visitors**: Customer profiles, ticket purchases, and merchandise transactions
- **Employees**: Staff information, schedules, time-off requests, and attendance records
- **Rides**: Attraction details, maintenance schedules, and status tracking
- **Merchandise**: Inventory management with automatic low-stock alerts
- **Events**: Special park events and scheduling
- **Weather Alerts**: System for park-wide weather notifications

## 💾 Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

### Backend Setup
1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following database configuration:
   ```
   DB_HOST=space-land.mysql.database.azure.com
   DB_USER=space_land2025
   DB_PASSWORD=$paceland25
   DB_NAME=spacelanddb25
   DB_PORT=3306
   ```

4. Import the database schema and initial data:
   - Use the provided SQL dump file to create and populate your database

5. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_BACKEND_URL=http://localhost:3000
   ```
   (or use the hosted backend URL if available)

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the application at `http://localhost:5173`

## 👥 User Roles and Access

The application supports four distinct user roles:

### 1. Visitors
- Can create accounts and log in
- Browse rides and attractions
- Purchase tickets and merchandise
- View purchase history
- Update personal information

### 2. Regular Employees
- Track work schedules
- Clock in/out for shifts
- Request time off
- Update personal information

### 3. Supervisors (Department-specific)
Each supervisor role has specialized access:

#### HR Supervisor
- Manage employee records
- Create and adjust schedules
- Process time-off requests
- Generate attendance reports

#### Maintenance Supervisor
- Track ride maintenance status
- Assign maintenance tasks
- Manage weather alerts
- View maintenance performance metrics

#### Merchandise Supervisor
- Monitor inventory levels
- Receive low-stock alerts
- Reorder merchandise
- Generate sales reports

### 4. System Administrator
- Full access to all system functions
- User management across all roles
- System configuration

## 🔒 Semantic Constraints

The database implements the following key constraints:

1. **Data Validation**:
   - Employee IDs must be unique
   - Visitor emails must be unique
   - Ride capacities must be positive integers

2. **Referential Integrity**:
   - Merchandise transactions must reference valid merchandise items
   - Employee schedules must reference valid employee IDs
   - Maintenance requests must reference existing rides

3. **Business Rules**:
   - Automatic low-stock alerts when merchandise inventory falls below threshold
   - Employees cannot be scheduled for overlapping shifts
   - Maintenance supervisors are notified when rides require maintenance

4. **Triggers**:
   - Stock level updates after merchandise sales
   - Automatic logging of employee attendance
   - Ride status updates based on maintenance completion

## 📊 Queries and Reports

The system provides various reports and data analysis capabilities:

1. **HR Reports**:
   - Employee attendance tracking
   - Schedule management and visualization
   - Time-off request processing

2. **Merchandise Reports**:
   - Sales analysis by item, date range, and location
   - Low stock notifications
   - Merchandise reorder management

3. **Maintenance Reports**:
   - Ride maintenance history
   - Maintenance staff performance metrics
   - Current maintenance request status

4. **Visitor Analysis**:
   - Ticket sales trends
   - Visitor demographic information
   - Purchase history tracking

## 🌐 Hosted Application

The application is hosted at the following URLs:

- **Frontend**: https://spaceland.vercel.app
- **Backend**: https://spacelandmark.onrender.com

### Login Credentials

#### Visitor Access:
- Username: katty123
- Password: pass000

#### Employee Access:
- Username: katrod
- Password: pass456

#### Supervisor Access (HR):
- Username: charlieb
- Password: pass789

#### Supervisor Access (Maintenance):
- Username: edwardm
- Password: pass654

#### Supervisor Access (Merchandise):
- Username: kat119
- Password: password1

## 🛠️ Technologies Used

- **Frontend**: React, Vite, HTML, CSS, JS, Framer Motion, Three.js
- **Backend**: Node.js
- **Database**: MySQL
- **Hosting**: Vercel (Frontend), Render (Backend), Azure (Database)


