import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function DeleteScheduleForm({ onScheduleDeleted }) {
    const [form, setForm] = useState({
        EmployeeID: '',
        scheduleDate: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${BACKEND_URL}/supervisor/HR/schedule-delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Schedule deleted successfully');
            onScheduleDeleted(); // refresh schedule list
            setForm({ EmployeeID: '', scheduleDate: '' }); // reset form
        } else {
            alert(data.error || 'Failed to delete schedule');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 bg-white/10 p-4 rounded-xl mb-4">
            <h3 className="font-bold text-lg">Delete Employee Schedule</h3>
            <input
                placeholder="Employee ID"
                value={form.EmployeeID}
                onChange={(e) => setForm({ ...form, EmployeeID: e.target.value })}
                className="w-full p-2 rounded"
                required
            />
            <input
                type="date"
                value={form.scheduleDate}
                onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })}
                className="w-full p-2 rounded"
                required
            />
            <button className="bg-red-600 px-4 py-2 rounded text-white">Delete Schedule</button>
        </form>
    );
}
