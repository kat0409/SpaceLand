import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function DeleteScheduleForm({ onScheduleDeleted }) {
    const [employees, setEmployees] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
    const [selectedScheduleDate, setSelectedScheduleDate] = useState('');

    // Load employee list on mount
    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/HR/employee-names`)
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
            })
            .catch(err => console.error("Failed to load employees:", err));
    }, []);

    // Load schedules when employee name changes
    useEffect(() => {
        if (!selectedEmployeeName) return;

        const employee = employees.find(e => e.FullName === selectedEmployeeName);
        if (!employee) return;

        const employeeID = employee.EmployeeID;

        fetch(`${BACKEND_URL}/supervisor/HR/get-specific-schedule`, {
            method: "POST", // ✅ must be POST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ EmployeeID: employeeID })
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSchedules(data);
                else setSchedules([]);
            })
            .catch(err => {
                console.error("Failed to fetch schedules:", err);
                setSchedules([]);
            });
    }, [selectedEmployeeName, employees]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const employee = employees.find(e => e.FullName === selectedEmployeeName);
        if (!employee) {
            alert("Could not match employee.");
            return;
        }

        const employeeID = employee.EmployeeID;

        const res = await fetch(`${BACKEND_URL}/supervisor/HR/schedule-delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                EmployeeID: employeeID,
                scheduleDate: selectedScheduleDate
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Schedule deleted successfully');
            onScheduleDeleted();
            setSelectedEmployeeName('');
            setSelectedScheduleDate('');
            setSchedules([]);
        } else {
            alert(data.error || 'Failed to delete schedule');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 bg-white/10 p-4 rounded-xl mb-4">
            <h3 className="font-bold text-lg">Delete Employee Schedule</h3>

            <select
                value={selectedEmployeeName}
                onChange={(e) => setSelectedEmployeeName(e.target.value)}
                className="w-full p-2 rounded"
                required
            >
                <option value="">Select an Employee</option>
                {employees.map(emp => (
                    <option key={emp.EmployeeID} value={emp.FullName}>
                        {emp.FullName}
                    </option>
                ))}
            </select>

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
