// src/components/employee/ClockInOutForm.jsx
import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function ClockInOutForm({ employeeID }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClock = async (action) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/employee/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ EmployeeID: employeeID }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message || `${action} successful`);
      } else {
        setStatus(data.error || `${action} failed`);
      }
    } catch (error) {
      console.error(`${action} error:`, error);
      setStatus(`${action} failed: network error`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-white">
      <h2 className="text-lg font-semibold mb-4">Clock In / Clock Out</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => handleClock('clock-in')}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Clock In
        </button>
        <button
          onClick={() => handleClock('clock-out')}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Clock Out
        </button>
      </div>
      {status && <p className="text-purple-300 mt-3">{status}</p>}
    </div>
  );
}
