// src/pages/SupervisorPortal.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function SupervisorPortal() {
  const [employees, setEmployees] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [ticketSales, setTicketSales] = useState([]);
  const [visitorRecords, setVisitorRecords] = useState([]);

  //maybe
  const [lowStockReport, setLowStockReport] = useState([]);
  const [rideMaintenanceReport, setRideMaintenanceReport] = useState([]);
  const [visitorPurchasesReport, setVisitorPurchasesReport] = useState([]);


  const supervisorID = localStorage.getItem('supervisorID');

  useEffect(() => {
    fetch(`${BACKEND_URL}/supervisor/employees?department=YourDepartmentHere`)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Employees Error:', err));

    fetch(`${BACKEND_URL}/supervisor/maintenance-requests`)
      .then(res => res.json())
      .then(data => setMaintenanceRequests(data))
      .catch(err => console.error('Maintenance Error:', err));

    fetch(`${BACKEND_URL}/supervisor/low-stock`)
      .then(res => res.json())
      .then(data => setLowStock(data))
      .catch(err => console.error('Low Stock Error:', err));

    fetch(`${BACKEND_URL}/supervisor/ticket-sales`)
      .then(res => res.json())
      .then(data => setTicketSales(data))
      .catch(err => console.error('Ticket Sales Error:', err));

    fetch(`${BACKEND_URL}/supervisor/visitors`)
      .then(res => res.json())
      .then(data => setVisitorRecords(data))
      .catch(err => console.error('Visitor Records Error:', err));

      fetch(`${BACKEND_URL}/supervisor/low-stock-merchandise`)
      .then(res => res.json())
      .then(data => setLowStockReport(data))
      .catch(err => console.error('Low Stock Merchandise Report Error:', err));
  
    fetch(`${BACKEND_URL}/supervisor/ride-maintenance`)
      .then(res => res.json())
      .then(data => setRideMaintenanceReport(data))
      .catch(err => console.error('Ride Maintenance Report Error:', err));
  
    fetch(`${BACKEND_URL}/supervisor/visitor-purchases`)
      .then(res => res.json())
      .then(data => setVisitorPurchasesReport(data))
      .catch(err => console.error('Visitor Purchases Report Error:', err));
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <h1 className="text-4xl font-bold mb-8 text-center">🛰 Supervisor Portal</h1>

        <div className="space-y-12">
          {/* EMPLOYEES */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">👨‍💼 Employees in Department</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-purple-300">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.EmployeeID} className="border-t border-white/10">
                      <td>{emp.FirstName} {emp.LastName}</td>
                      <td>{emp.Email}</td>
                      <td>{emp.Department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MAINTENANCE REQUESTS */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">🛠 Maintenance Requests</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              <ul className="space-y-2">
                {maintenanceRequests.map(req => (
                  <li key={req.MaintenanceID} className="border-b border-white/10 pb-2">
                    Ride ID: {req.RideID} | Status: {req.MaintenanceStatus ? 'Completed' : 'Pending'}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LOW STOCK MERCHANDISE */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">📦 Low Stock Alerts</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              <ul className="space-y-2">
                {lowStock.map(item => (
                  <li key={item.merchandiseID} className="border-b border-white/10 pb-2">
                    {item.itemName} — Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* TICKET SALES */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">🎟 Ticket Sales</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-purple-300">
                  <tr>
                    <th>Ticket ID</th>
                    <th>Visitor ID</th>
                    <th>Type</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketSales.map(ticket => (
                    <tr key={ticket.ticketID} className="border-t border-white/10">
                      <td>{ticket.ticketID}</td>
                      <td>{ticket.VisitorID}</td>
                      <td>{ticket.ticketType}</td>
                      <td>${ticket.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Merchandise Report */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">📉 Low Stock Merchandise Report</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              {lowStockReport.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="text-left text-purple-300">
                    <tr>
                      <th>Item Name</th>
                      <th>Remaining Stock</th>
                      <th>Supervisor Email</th>
                      <th>Notification Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockReport.map((item, idx) => (
                      <tr key={idx} className="border-t border-white/10">
                        <td>{item.Merchandise_Item}</td>
                        <td>{item.Remaining_Stock}</td>
                        <td>{item.Supervisor_Email}</td>
                        <td>{new Date(item.Notification_Date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No low stock notifications.</p>
              )}
            </div>
          </div>

          {/* Ride Maintenance Report */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">🛠 Ride Maintenance Report</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              {rideMaintenanceReport.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="text-left text-purple-300">
                    <tr>
                      <th>Ride</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Maintenance Employee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rideMaintenanceReport.map((item, idx) => (
                      <tr key={idx} className="border-t border-white/10">
                        <td>{item.Ride}</td>
                        <td>{new Date(item.Start_Date).toLocaleDateString()}</td>
                        <td>{new Date(item.End_Date).toLocaleDateString()}</td>
                        <td>{item.Maintenance_Employee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No maintenance records found.</p>
              )}
            </div>
          </div>

          {/* Visitor Purchases Report */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">💳 Visitor Purchases Report</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              {visitorPurchasesReport.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="text-left text-purple-300">
                    <tr>
                      <th>Visitor ID</th>
                      <th>Visitor Name</th>
                      <th>Ticket Type</th>
                      <th>Ticket Quantity</th>
                      <th>Ticket Total Spent</th>
                      <th>Merchandise Bought</th>
                      <th>Merchandise Quantity</th>
                      <th>Merchandise Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitorPurchasesReport.map((item, idx) => (
                      <tr key={idx} className="border-t border-white/10">
                        <td>{item.VisitorID}</td>
                        <td>{item.Visitor_Name}</td>
                        <td>{item.Ticket_Type || 'N/A'}</td>
                        <td>{item.Ticket_Quantity || 'N/A'}</td>
                        <td>${item.Ticket_Total_Spent || 0}</td>
                        <td>{item.Merchandise_Bought || 'N/A'}</td>
                        <td>{item.Merchandise_Quantity || 'N/A'}</td>
                        <td>${item.Merchandise_Total_Spent || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No purchases recorded.</p>
              )}
            </div>
          </div>

          {/* VISITOR RECORDS */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">📋 Visitor Records</h2>
            <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-purple-300">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Military</th>
                  </tr>
                </thead>
                <tbody>
                  {visitorRecords.map(visitor => (
                    <tr key={visitor.VisitorID} className="border-t border-white/10">
                      <td>{visitor.FirstName} {visitor.LastName}</td>
                      <td>{visitor.Email}</td>
                      <td>{visitor.Username}</td>
                      <td>{visitor.MilitaryStatus ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
