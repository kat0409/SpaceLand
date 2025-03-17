// src/pages/EmployeeDashboard.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

  const employeeID = localStorage.getItem('employeeID');

  useEffect(() => {
    if (!employeeID) {
      setError('Employee ID not found in localStorage.');
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/employee/account-info?employeeID=${employeeID}`);
        const data = await res.json();

        if (res.ok && data.length > 0) {
          setEmployee(data[0]);
        } else {
          setError('Unable to fetch employee info.');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Error fetching employee data.');
      }
    };

    fetchEmployeeData();
  }, [employeeID]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/10">
          <h1 className="text-3xl font-bold mb-4 text-center">🧑‍💼 Employee Dashboard</h1>

          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

          {employee ? (
            <div className="space-y-4 text-sm md:text-base">
              <p><strong>Name:</strong> {employee.FirstName} {employee.LastName}</p>
              <p><strong>Email:</strong> {employee.Email}</p>
              <p><strong>Department:</strong> {employee.Department}</p>
              <p><strong>Supervisor ID:</strong> {employee.SupervisorID}</p>
              <p><strong>Address:</strong> {employee.Address}</p>
              <p><strong>Employment Status:</strong> {employee.employmentStatus === 1 ? 'Active' : 'Inactive'}</p>
              <p><strong>Username:</strong> {employee.username}</p>
            </div>
          ) : !error && (
            <p className="text-center text-gray-400">Loading employee data...</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}