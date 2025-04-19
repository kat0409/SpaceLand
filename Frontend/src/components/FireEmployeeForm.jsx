import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function FireEmployeeForm() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load employees on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/supervisor/HR/employee-names`)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Failed to load employees", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    if (!selectedEmployeeID) {
      setMessage({ text: 'Please select an employee to fire.', type: 'error' });
      setIsLoading(false);
      return;
    }

    const confirmed = window.confirm("Are you sure you want to fire this employee?");
    if (!confirmed) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/supervisor/HR/fire-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ EmployeeID: selectedEmployeeID }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Employee fired and archived successfully!', type: 'success' });
        setEmployees(prev => prev.filter(e => e.EmployeeID != selectedEmployeeID));
        setSelectedEmployeeID('');
      } else {
        setMessage({ text: data.error || 'Failed to fire employee', type: 'error' });
      }
    } catch (err) {
      console.error("Error firing employee:", err);
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/10 p-4 rounded-xl mt-6">
      <h3 className="text-lg font-bold">Fire Employee</h3>

      {message.text && (
        <div
          className={`p-2 rounded ${
            message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

        <select
        value={selectedEmployeeID}
        onChange={(e) => setSelectedEmployeeID(e.target.value)}
        className="w-full p-2 rounded"
        required
        >
        <option value="">Select an Employee to Fire</option>
        {employees.map(emp => (
            <option key={emp.EmployeeID} value={emp.EmployeeID}>
            {emp.FullName}
            </option>
        ))}
        </select>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition"
      >
        {isLoading ? 'Firing...' : 'Fire Employee'}
      </button>
    </form>
  );
}