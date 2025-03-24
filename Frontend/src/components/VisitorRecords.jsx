// src/components/RideMaintenanceReport.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RideMaintenanceReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://spacelandmark.onrender.com/supervisor/maintenance/ride-maintenance")
      .then((res) => {
        setReport(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ride maintenance report:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading ride maintenance report...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Ride</th>
            <th className="px-4 py-2 border">Start Date</th>
            <th className="px-4 py-2 border">End Date</th>
            <th className="px-4 py-2 border">Maintenance Employee</th>
          </tr>
        </thead>
        <tbody>
          {report.map((row, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2 border">{row.Ride}</td>
              <td className="px-4 py-2 border">{row.Start_Date?.split("T")[0]}</td>
              <td className="px-4 py-2 border">{row.End_Date?.split("T")[0]}</td>
              <td className="px-4 py-2 border">{row.Maintenance_Employee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RideMaintenanceReport;