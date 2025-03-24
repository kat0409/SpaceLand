// src/components/VisitorPurchasesReport.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VisitorPurchasesReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://spacelandmark.onrender.com/supervisor/visitor-purchases")
      .then((res) => {
        setReport(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching visitor purchases report:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading visitor purchases report...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Visitor Name</th>
            <th className="px-4 py-2 border">Ticket Type</th>
            <th className="px-4 py-2 border">Ticket Quantity</th>
            <th className="px-4 py-2 border">Ticket Total Spent</th>
            <th className="px-4 py-2 border">Merchandise Bought</th>
            <th className="px-4 py-2 border">Merch Quantity</th>
            <th className="px-4 py-2 border">Merch Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {report.map((row, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2 border">{row.Visitor_Name || '-'}</td>
              <td className="px-4 py-2 border">{row.Ticket_Type || '-'}</td>
              <td className="px-4 py-2 border">{row.Ticket_Quantity || 0}</td>
              <td className="px-4 py-2 border">${row.Ticket_Total_Spent || 0}</td>
              <td className="px-4 py-2 border">{row.Merchandise_Bought || '-'}</td>
              <td className="px-4 py-2 border">{row.Merchandise_Quantity || 0}</td>
              <td className="px-4 py-2 border">${row.Merchandise_Total_Spent || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorPurchasesReport;