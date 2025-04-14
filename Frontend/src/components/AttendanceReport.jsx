import React, { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function AttendanceReport() {
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: 'all',
    employeeID: 'all'
  });

  useEffect(() => {
    setDepartments(["Security", "Merchandise", "Maintenance", "Management"]);

    fetch(`${BACKEND_URL}/supervisor/HR/all-employee-names`)
      .then(res => res.json())
      .then(setEmployees)
      .catch(console.error);
  }, []);

  const fetchAttendanceRecords = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.department !== 'all') params.append('department', filters.department);
    if (filters.employeeID !== 'all') params.append('employeeID', filters.employeeID);

    fetch(`${BACKEND_URL}/supervisor/HR/attendance-report?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          console.error("Unexpected response:", data);
          setRecords([]);
        }
      })
      .catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Employee Attendance Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="p-2 rounded bg-black/40 text-white"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className="p-2 rounded bg-black/40 text-white"
        />
        <select
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="p-2 rounded bg-black/40 text-white"
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          name="employeeID"
          value={filters.employeeID}
          onChange={handleChange}
          className="p-2 rounded bg-black/40 text-white"
        >
          <option value="all">All Employees</option>
          {employees.map(e => (
            <option key={e.EmployeeID} value={e.EmployeeID}>
              {e.FirstName} {e.LastName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <button
          onClick={fetchAttendanceRecords}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition"
        >
          Apply Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-white">
          <thead className="bg-purple-900/50">
            <tr>
              <th className="p-2">Employee</th>
              <th className="p-2">Department</th>
              <th className="p-2">Date</th>
              <th className="p-2">Clock In</th>
              <th className="p-2">Clock Out</th>
              <th className="p-2">Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="bg-black/20 border-b border-white/10">
                <td className="p-2">{r.FullName}</td>
                <td className="p-2">{r.Department}</td>
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.clockIn}</td>
                <td className="p-2">{r.clockOut}</td>
                <td className="p-2">
                    {isNaN(Number(r.HoursWorked)) ? 'N/A' : Number(r.HoursWorked).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-white mt-4">No records found.</p>
        )}
      </div>
    </div>
  );
}
