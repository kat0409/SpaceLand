import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function EmployeeProfileForm() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState('');
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Address: '',
    username: '',
    password: '',
    Department: '',
    employmentStatus: '',
    SupervisorID: ''
  });

  useEffect(() => {
    fetch(`${BACKEND_URL}/supervisor/HR/employee-names`)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Failed to load employees", err));
  }, []);

  useEffect(() => {
    if (!selectedEmployeeID) return;
    const selected = employees.find(e => e.EmployeeID == selectedEmployeeID);
    if (!selected) return;

    setFormData({
      FirstName: selected.FirstName || '',
      LastName: selected.LastName || '',
      Email: selected.Email || '',
      Address: selected.Address || '',
      username: selected.username || '',
      password: '',
      Department: selected.Department || '',
      employmentStatus: selected.employmentStatus || '',
      SupervisorID: selected.SupervisorID || ''
    });
  }, [selectedEmployeeID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BACKEND_URL}/supervisor/HR/update-employee-profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EmployeeID: selectedEmployeeID, ...formData })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Employee profile updated successfully");
    } else {
      alert(data.error || "Failed to update employee");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white/10 p-4 rounded-xl mb-6">
      <h3 className="text-lg font-bold">Edit Employee Profile</h3>

      <select
        value={selectedEmployeeID}
        onChange={(e) => setSelectedEmployeeID(e.target.value)}
        className="w-full p-2 rounded"
        required
      >
        <option value="">Select an Employee</option>
        {employees.map(emp => (
          <option key={emp.EmployeeID} value={emp.EmployeeID}>
            {emp.FirstName} {emp.LastName}
          </option>
        ))}
      </select>

      {selectedEmployeeID && (
        <>
          <input name="FirstName" value={formData.FirstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 rounded" />
          <input name="LastName" value={formData.LastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 rounded" />
          <input name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded" />
          <input name="Address" value={formData.Address} onChange={handleChange} placeholder="Address" className="w-full p-2 rounded" />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="w-full p-2 rounded" />
          <input name="password" value={formData.password} onChange={handleChange} placeholder="New Password (optional)" className="w-full p-2 rounded" />
          <input name="Department" value={formData.Department} onChange={handleChange} placeholder="Department" className="w-full p-2 rounded" />
          <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="w-full p-2 rounded">
            <option value="">Employment Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <input name="SupervisorID" value={formData.SupervisorID} onChange={handleChange} placeholder="Supervisor ID" className="w-full p-2 rounded" />

          <button className="bg-blue-600 px-4 py-2 rounded text-white">Save Changes</button>
        </>
      )}
    </form>
  );
}
