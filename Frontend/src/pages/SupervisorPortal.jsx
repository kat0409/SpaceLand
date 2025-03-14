// src/pages/SupervisorPortal.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SupervisorPortal() {
  const [supervisorID, setSupervisorID] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [sales, setSales] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [visitors, setVisitors] = useState([]);

  // 🔁 MOCK DATA FOR DESIGN PREVIEW
  useEffect(() => {
    setSupervisorID("123"); // Mock supervisor ID

    setEmployees([
      { EmployeeID: 1, FirstName: "Alice", LastName: "Johnson", Department: "Operations" },
      { EmployeeID: 2, FirstName: "Bob", LastName: "Smith", Department: "Maintenance" },
    ]);

    setMaintenance([
      { RideID: 101, MaintenanceStartDate: "2025-03-14" },
      { RideID: 102, MaintenanceStartDate: "2025-03-15" },
    ]);

    setLowStock([
      { itemName: "Rocket Fuel Soda", quantity: 2 },
      { itemName: "Alien Plushie", quantity: 1 },
    ]);

    setSales([
      { VisitorID: 201, totalAmount: 42.99 },
      { VisitorID: 202, totalAmount: 58.00 },
    ]);

    setTickets([
      { TicketID: 301, ticketType: "Cosmic" },
      { TicketID: 302, ticketType: "General" },
    ]);

    setVisitors([
      { FirstName: "John", LastName: "Pork", Username: "porkman" },
      { FirstName: "Jane", LastName: "Doe", Username: "janed" },
    ]);
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">🚀 Supervisor Portal</h2>
          <p className="text-gray-400 mb-10">Welcome, Supervisor #{supervisorID}</p>

          {/* Employee Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">👨‍💼 Employees in Your Department</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {employees.map(emp => (
                <div key={emp.EmployeeID} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p><span className="font-bold">Name:</span> {emp.FirstName} {emp.LastName}</p>
                  <p><span className="font-bold">Department:</span> {emp.Department}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">🛠️ Rides Needing Maintenance</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {maintenance.map((m, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p><span className="font-bold">Ride ID:</span> {m.RideID}</p>
                  <p><span className="font-bold">Start Date:</span> {m.MaintenanceStartDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">📦 Low Stock Alerts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {lowStock.map((item, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p><span className="font-bold">Item:</span> {item.itemName}</p>
                  <p><span className="font-bold">Quantity:</span> {item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Merchandise Sales */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">💰 Merchandise Sales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {sales.map((sale, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p><span className="font-bold">Visitor ID:</span> {sale.VisitorID}</p>
                  <p><span className="font-bold">Total:</span> ${sale.totalAmount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Sales */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">🎟️ Ticket Sales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {tickets.map((ticket, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p><span className="font-bold">Ticket ID:</span> {ticket.TicketID}</p>
                  <p><span className="font-bold">Type:</span> {ticket.ticketType}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visitor Records */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">📋 Visitor Records</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {visitors.map((visitor, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p><span className="font-bold">Name:</span> {visitor.FirstName} {visitor.LastName}</p>
                  <p><span className="font-bold">Username:</span> {visitor.Username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}