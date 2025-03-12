// src/pages/SupervisorPortal.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SupervisorPortal() {
  const [employees, setEmployees] = useState([]);
  const [maintenanceRides, setMaintenanceRides] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/employees') // later replace with full backend endpoint
      .then(res => res.json())
      .then(data => setEmployees(data));

    fetch('/rides') // assuming rides also includes a flag for maintenance
      .then(res => res.json())
      .then(data => setMaintenanceRides(data.filter(ride => ride.MaintenanceNeed)));

    fetch('/notifications') // hypothetical route for unsent notifications
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen px-6 py-20 text-white bg-gradient-to-b from-black via-gray-900 to-black">
        <h1 className="text-4xl font-bold mb-8 text-center">🛰 Supervisor Portal</h1>

        <div className="space-y-12 max-w-5xl mx-auto">
          {/* Employees */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">👥 Department Employees</h2>
            <ul className="space-y-2">
              {employees.map((emp) => (
                <li key={emp.EmployeeID} className="border border-gray-700 p-4 rounded-lg bg-white/5">
                  {emp.FirstName} {emp.LastName} — {emp.Department}
                </li>
              ))}
            </ul>
          </div>

          {/* Maintenance */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">🔧 Rides Needing Maintenance</h2>
            <ul className="space-y-2">
              {maintenanceRides.map((ride) => (
                <li key={ride.RideID} className="border border-gray-700 p-4 rounded-lg bg-white/5">
                  {ride.rideName} — Maintenance Required
                </li>
              ))}
            </ul>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">📢 Low Stock Notifications</h2>
            <ul className="space-y-2">
              {notifications.map((note, idx) => (
                <li key={idx} className="border border-gray-700 p-4 rounded-lg bg-white/5">
                  Item: {note.itemName} — Notification ID: {note.notificationID}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}