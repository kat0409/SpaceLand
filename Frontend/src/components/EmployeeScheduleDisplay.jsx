import React, { useEffect, useState } from "react";

const EmployeeScheduleList = ({ refreshKey }) => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        fetch("/supervisor/HR/get-schedule")
        .then((res) => res.json())
        .then((data) => setSchedules(data))
        .catch((err) => console.error("Failed to load schedule:", err));
    }, [refreshKey]);

    return (
        <div className="bg-white/10 p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Employee Schedules</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
            <thead className="text-purple-300">
                <tr>
                <th className="p-2">Employee ID</th>
                <th className="p-2">Department</th>
                <th className="p-2">Date</th>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Recurring</th>
                </tr>
            </thead>
            <tbody>
                {schedules.map((s, idx) => (
                <tr key={idx} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-2">{s.EmployeeID}</td>
                    <td className="p-2">{s.Department}</td>
                    <td className="p-2">{new Date(s.scheduleDate).toLocaleDateString()}</td>
                    <td className="p-2">{s.shiftStart}</td>
                    <td className="p-2">{s.shiftEnd}</td>
                    <td className="p-2">{s.isRecurring ? "Yes" : "No"}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default EmployeeScheduleList;
