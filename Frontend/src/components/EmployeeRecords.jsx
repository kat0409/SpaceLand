// src/components/EmployeeRecords.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://spacelandmark.onrender.com/employees")
      .then((res) => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employee records:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading employee records...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Employee ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {records.map((e, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2 border">{e.EmployeeID}</td>
              <td className="px-4 py-2 border">{e.FirstName} {e.LastName}</td>
              <td className="px-4 py-2 border">{e.Department}</td>
              <td className="px-4 py-2 border">{e.employmentStatus === 1 ? "Active" : "Inactive"}</td>
              <td className="px-4 py-2 border">{e.Email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeRecords;