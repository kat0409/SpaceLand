// src/pages/EmployeeDashboard.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [supervisorName, setSupervisorName] = useState('');
  const employeeID = localStorage.getItem('employeeID'); // or from context

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:3000/getEmployeeInfo?id=${employeeID}`);
        const data = await res.json();
        setEmployeeData(data[0]); // assuming array response

        // Fetch Supervisor Info
        const supRes = await fetch(`http://localhost:3000/getSupervisorInfo?id=${data[0].SupervisorID}`);
        const supData = await supRes.json();
        const supervisor = supData[0];
        setSupervisorName(`${supervisor.firstName} ${supervisor.lastName}`);
      } catch (err) {
        console.error('Error fetching employee data', err);
      }
    };

    if (employeeID) fetchEmployee();
  }, [employeeID]);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-16">
        <div className="max-w-4xl mx-auto bg-white/10 p-8 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">🧑‍🚀 Employee Dashboard</h2>

          {!employeeData ? 
          (
            <p>Loading employee details...</p>
          ) : 
          (
            <div className="space-y-4 text-lg">
              <p><span className="font-semibold text-purple-400">Employee ID:</span> {employeeData.EmployeeID}</p>
              <p><span className="font-semibold text-purple-400">Name:</span> {employeeData.FirstName} {employeeData.LastName}</p>
              <p><span className="font-semibold text-purple-400">Email:</span> {employeeData.Email}</p>
              <p><span className="font-semibold text-purple-400">Address:</span> {employeeData.Address}</p>
              <p><span className="font-semibold text-purple-400">Department:</span> {employeeData.Department}</p>
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