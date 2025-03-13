// src/pages/SupervisorPortal.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SupervisorPortal() {
  const [supervisorData, setSupervisorData] = useState({
    SupervisorID: localStorage.getItem('supervisorID') || '',
    Name: localStorage.getItem('employeeName') || '',
    Department: localStorage.getItem('department') || '',
  });

  const [employees, setEmployees] = useState([]);
  const [maintenanceRides, setMaintenanceRides] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisorPortalData = async () => {
      try {
        // Fetch all employees and filter by department
        const empRes = await fetch('https://spaceland.onrender.com/employees');
        const empData = await empRes.json();
        const filteredEmployees = empData.filter(
          (emp) => emp.Department === supervisorData.Department
        );
        setEmployees(filteredEmployees);

        // Fetch rides needing maintenance
        const rideRes = await fetch('https://spaceland.onrender.com/rides');
        const rideData = await rideRes.json();
        const filteredRides = rideData.filter((ride) => ride.MaintenanceNeed === 1);
        setMaintenanceRides(filteredRides);

        // Fetch unsent notifications (if backend has route for this)
        const notifRes = await fetch('https://spaceland.onrender.com/notifications');
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData);
        }
      } catch (err) {
        console.error('Supervisor dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisorPortalData();
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <h1 className="text-4xl font-bold mb-8 text-center">🛰 Supervisor Portal</h1>

          {/* Supervisor Info */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10 space-y-2">
            <h2 className="text-2xl font-semibold mb-2">🧑‍💼 Supervisor Info</h2>
            <p><strong>ID:</strong> {supervisorData.SupervisorID}</p>
            <p><strong>Name:</strong> {supervisorData.Name}</p>
            <p><strong>Department:</strong> {supervisorData.Department}</p>
          </div>

          {/* Employees */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">👥 Department Employees</h2>
            {employees.length ? (
              <ul className="space-y-2">
                {employees.map((emp) => (
                  <li key={emp.EmployeeID} className="border border-gray-700 p-4 rounded-lg bg-white/5">
                    {emp.FirstName} {emp.LastName} — {emp.Email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No employees found in your department.</p>
            )}
          </div>

          {/* Maintenance Rides */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">🔧 Rides Needing Maintenance</h2>
            {maintenanceRides.length ? (
              <ul className="space-y-2">
                {maintenanceRides.map((ride) => (
                  <li key={ride.RideID} className="border border-gray-700 p-4 rounded-lg bg-white/5">
                    {ride.rideName} — Maintenance Required
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No rides currently need maintenance.</p>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">📢 Low Stock Notifications</h2>
            {notifications.length ? (
              <ul className="space-y-2">
                {notifications.map((note, idx) => (
                  <li key={idx} className="border border-gray-700 p-4 rounded-lg bg-white/5">
                    Item: {note.itemName} — Notification ID: {note.notificationID}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No low stock notifications at the moment.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}