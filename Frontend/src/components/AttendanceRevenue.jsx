// src/components/AttendanceRevenue.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceRevenue = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://spacelandmark.onrender.com/supervisor/attendance-revenue")
      .then((res) => {
        setReport(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance and revenue report:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading attendance and revenue report...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Tickets Sold</th>
            <th className="px-4 py-2 border">Total Revenue</th>
            <th className="px-4 py-2 border">Weather Condition</th>
          </tr>
        </thead>
        <tbody>
          {report.map((row, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2 border">{row.Operating_Date}</td>
              <td className="px-4 py-2 border">{row.Tickets_Sold}</td>
              <td className="px-4 py-2 border">${row.Total_Ticket_Revenue}</td>
              <td className="px-4 py-2 border">{row.Weather_Condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceRevenue;