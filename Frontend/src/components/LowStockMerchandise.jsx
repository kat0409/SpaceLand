// src/components/LowStockMerchandise.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LowStockMerchandise = () => {
  const [merchandise, setMerchandise] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://spacelandmark.onrender.com/supervisor/merchandise/low-stock")
      .then((res) => {
        setMerchandise(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching low stock merchandise:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading low stock merchandise...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Item ID</th>
            <th className="px-4 py-2 border">Item Name</th>
            <th className="px-4 py-2 border">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {merchandise.map((item, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2 border">{item.merchandiseID}</td>
              <td className="px-4 py-2 border">{item.itemName}</td>
              <td className="px-4 py-2 border">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockMerchandise;