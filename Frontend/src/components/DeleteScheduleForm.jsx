import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function DeleteScheduleForm() {
    const [employees, setEmployees] = useState([]);
    const [scheduleDates, setScheduleDates] = useState([]);
    const [selectedEmployeeID, setSelectedEmployeeID] = useState('');
    const [selectedScheduleDate, setSelectedScheduleDate] = useState('');
    const [message, setMessage] = useState('');

    // Load employee names and IDs for dropdown
    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/HR/all-employee-names`)
        .then(res => res.json())
        .then(data => setEmployees(data))
        .catch(err => console.error("Failed to fetch employees:", err));
    }, []);

    // Load schedule when employee is selected
    useEffect(() => {
        if (!selectedEmployeeID){
            setScheduleDates([]);
            return;
        }

        fetch(`${BACKEND_URL}/supervisor/HR/get-specific-schedule?EmployeeID=${selectedEmployeeID}`)
        .then(res => res.json())
        .then(data => setScheduleDates(data.map(row => row.scheduleDate)))
            .catch(err => {
                console.error("Failed to fetch schedule:", err);
                setScheduleDates([]);
            });
    }, [selectedEmployeeID]);

    const handleSubmit = async () => {
        if(!selectedEmployeeID || !selectedScheduleDate){
            return;
        }

        const formattedDate = new Date(selectedScheduleDate).toISOString().split("T")[0];

        try{
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
                setScheduleDates(prev => prev.filter(date => date !== selectedScheduleDate));
                setSelectedScheduleDate("");
            } else {
                setMessage(`Error: ${data.error || "Unknown error"}`);
            }
        }
        catch(error){
            console.error("Error deleting schedule:", error);
            setMessage("Failed to delete schedule.");
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">Delete Employee Schedule</h2>

            {/* Employee Dropdown */}
            <div className="mb-4">
                <label className="block mb-1 text-white">Select Employee</label>
                <select
                    value={selectedEmployeeID}
                    onChange={e => {
                        setSelectedEmployeeID(e.target.value);
                        setSelectedScheduleDate("");
                    }}
                    className="w-full p-2 rounded bg-black text-white"
                >
                    <option value="">-- Choose an employee --</option>
                    {employees.map(emp => (
                        <option key={emp.EmployeeID} value={emp.EmployeeID}>
                            {emp.FirstName} {emp.LastName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Schedule Date Dropdown */}
            {scheduleDates.length > 0 && (
                <div className="mb-4">
                    <label className="block mb-1 text-white">Select Schedule Date</label>
                    <select
                        value={selectedScheduleDate}
                        onChange={e => setSelectedScheduleDate(e.target.value)}
                        className="w-full p-2 rounded bg-black text-white"
                    >
                        <option value="">-- Choose a date --</option>
                        {scheduleDates.map(date => (
                            <option key={date} value={date}>
                                {new Date(date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Delete Button */}
            <button
                disabled={!selectedEmployeeID || !selectedScheduleDate}
                onClick={handleSubmit}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-40"
            >
                Delete Schedule
            </button>

            {/* Message */}
            {message && <p className="mt-4 text-white">{message}</p>}
        </div>
    );
}
