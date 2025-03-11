// src/pages/EmployeeDashboard.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [supervisorName, setSupervisorName] = useState('');

  // Temporary mock data – replace with API call later
  useEffect(() => {
    const mockEmployee = {
      employeeID: 42,
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex.j@spaceland.com',
      address: '123 Cosmic Blvd',
      employmentStatus: 'Active',
      department: 'Ride Operations',
      supervisorID: 3,
    };

    const mockSupervisors = {
      3: { firstName: 'Sarah', lastName: 'Lee' },
    };

    setEmployeeData(mockEmployee);
    if (mockSupervisors[mockEmployee.supervisorID]) {
      const { firstName, lastName } = mockSupervisors[mockEmployee.supervisorID];
      setSupervisorName(`${firstName} ${lastName}`);
    }
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-16">
        <div className="max-w-4xl mx-auto bg-white/10 p-8 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">🧑‍🚀 Employee Dashboard</h2>

          {!employeeData ? (
            <p>Loading employee details...</p>
          ) : (
            <div className="space-y-4 text-lg">
              <p><span className="font-semibold text-purple-400">Employee ID:</span> {employeeData.employeeID}</p>
              <p><span className="font-semibold text-purple-400">Name:</span> {employeeData.firstName} {employeeData.lastName}</p>
              <p><span className="font-semibold text-purple-400">Email:</span> {employeeData.email}</p>
              <p><span className="font-semibold text-purple-400">Address:</span> {employeeData.address}</p>
              <p><span className="font-semibold text-purple-400">Department:</span> {employeeData.department}</p>
              <p><span className="font-semibold text-purple-400">Employment Status:</span> {employeeData.employmentStatus}</p>
              <p><span className="font-semibold text-purple-400">Supervisor:</span> {supervisorName}</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}