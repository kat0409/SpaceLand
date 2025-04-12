import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function DeleteScheduleForm({ onScheduleDeleted }) {
    const [employees, setEmployees] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedEmployeeID, setSelectedEmployeeID] = useState('');
    const [selectedScheduleDate, setSelectedScheduleDate] = useState('');

    // Load employee names on mount
    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/HR/employee-names`)
        .then(res => res.json())
        .then(data => setEmployees(data))
        .catch(err => console.error("Failed to load employees:", err));
    }, []);

    // Load schedule when employee changes
    useEffect(() => {
        if (!selectedEmployeeID) return;

        fetch(`${BACKEND_URL}/supervisor/HR/get-specific-schedule?EmployeeID=${selectedEmployeeID}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setSchedules(data);
            else setSchedules([]);
        })
        .catch(err => {
            console.error("Failed to fetch schedules:", err);
            setSchedules([]);
        });
    }, [selectedEmployeeID]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${BACKEND_URL}/supervisor/HR/schedule-delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                EmployeeID: parseInt(selectedEmployeeID),
                scheduleDate: selectedScheduleDate
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Schedule deleted successfully');
            onScheduleDeleted();
            setSelectedEmployeeID('');
            setSelectedScheduleDate('');
            setSchedules([]);
        } else {
            alert(data.error || 'Failed to delete schedule');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 bg-white/10 p-4 rounded-xl mb-4">
        <h3 className="font-bold text-lg">Delete Employee Schedule</h3>

        {/* Employee dropdown */}
        <select
            value={selectedEmployeeID}
            onChange={(e) => setSelectedEmployeeID(e.target.value)}
            className="w-full p-2 rounded"
            required
        >
            <option value="">Select an Employee</option>
            {employees.map(emp => (
            <option key={emp.EmployeeID} value={emp.EmployeeID}>
                {emp.FullName}
            </option>
            ))}
        </select>

        {/* Schedule dropdown */}
        <select
            value={selectedScheduleDate}
            onChange={(e) => setSelectedScheduleDate(e.target.value)}
            className="w-full p-2 rounded"
            required
            disabled={!schedules.length}
        >
            <option value="">Select a Schedule Date</option>
            {schedules.map((s, idx) => (
            <option key={idx} value={s.scheduleDate}>
                {new Date(s.scheduleDate).toLocaleDateString()}
            </option>
            ))}
        </select>

        <button className="bg-red-600 px-4 py-2 rounded text-white">Delete Schedule</button>
        </form>
    );
}
