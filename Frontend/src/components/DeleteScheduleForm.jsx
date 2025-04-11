import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function DeleteScheduleForm({ onScheduleDeleted }) {
    const [schedules, setSchedules] = useState([]);
    const [selected, setSelected] = useState('');

    useEffect(() => {
        // Fetch all existing schedules from the backend
        fetch(`${BACKEND_URL}/supervisor/HR/get-schedule`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSchedules(data);
            })
            .catch(err => console.error("Error loading schedules:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [EmployeeID, scheduleDate] = selected.split('|');

        const res = await fetch(`${BACKEND_URL}/supervisor/HR/delete-schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ EmployeeID, scheduleDate }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Schedule deleted successfully');
            onScheduleDeleted(); // refresh
            setSelected('');
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
                <option value="">Select a schedule</option>
                {schedules.map((s, idx) => (
                    <option key={idx} value={`${s.EmployeeID}|${s.scheduleDate}`}>
                        {`Employee ${s.EmployeeID} – ${new Date(s.scheduleDate).toLocaleDateString()}`}
                    </option>
                ))}
            </select>

            <button className="bg-red-600 px-4 py-2 rounded text-white">Delete Schedule</button>
        </form>
    );
}
