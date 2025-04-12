import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function DeleteScheduleForm({ onScheduleDeleted }) {
  const [scheduledShifts, setScheduledShifts] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/supervisor/HR/shifts-with-names`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setScheduledShifts(data);
      })
      .catch(err => console.error("Failed to load shifts:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const [EmployeeID, scheduleDate] = selected.split('|');

    const res = await fetch(`${BACKEND_URL}/supervisor/HR/schedule-delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EmployeeID, scheduleDate }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Schedule deleted successfully');
      onScheduleDeleted();
      setSelected('');
      setScheduledShifts(prev =>
        prev.filter(s => !(s.EmployeeID == EmployeeID && s.scheduleDate === scheduleDate))
      );
    } else {
      alert(data.error || 'Failed to delete schedule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white/10 p-4 rounded-xl mb-4">
      <h3 className="font-bold text-lg">Delete Employee Schedule</h3>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full p-2 rounded"
        required
      >
        <option value="">Select a Scheduled Shift</option>
        {scheduledShifts.map((s, idx) => (
          <option key={idx} value={`${s.EmployeeID}|${s.scheduleDate}`}>
            {s.FullName} — {new Date(s.scheduleDate).toLocaleDateString()}
          </option>
        ))}
      </select>

      <button className="bg-red-600 px-4 py-2 rounded text-white">Delete Schedule</button>
    </form>
  );
}
