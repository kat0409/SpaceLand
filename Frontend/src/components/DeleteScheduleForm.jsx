import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function DeleteScheduleForm({ onScheduleDeleted }) {
    const [employees, setEmployees] = useState([]);
    const [scheduleDates, setScheduleDates] = useState([]);
    const [selectedEmployeeID, setSelectedEmployeeID] = useState('');
    const [selectedScheduleDate, setSelectedScheduleDate] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
                    scheduleDate: formattedDate
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Get employee name for the success message
                const employee = employees.find(emp => emp.EmployeeID === selectedEmployeeID);
                const employeeName = employee ? `${employee.FirstName} ${employee.LastName}` : `Employee #${selectedEmployeeID}`;
                
                // Format the date for a more readable success message
                const shiftDate = new Date(selectedScheduleDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                setSuccessMessage(`Schedule for ${employeeName} on ${shiftDate} has been deleted successfully.`);
                setShowSuccessPopup(true);
                
                // Auto-hide popup after 3 seconds
                setTimeout(() => {
                    setShowSuccessPopup(false);
                }, 3000);
                
                setScheduleDates(prev => prev.filter(date => date !== selectedScheduleDate));
                setSelectedScheduleDate("");
                
                // Trigger refresh in parent if provided
                if (typeof onScheduleDeleted === 'function') {
                    onScheduleDeleted();
                }
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
        <div className="bg-gray-800/50 rounded-xl p-6 relative">
            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
                    <div className="bg-gradient-to-b from-gray-900 to-black border border-purple-500 rounded-xl p-8 max-w-md mx-auto shadow-lg shadow-purple-500/30 animate-fadeIn">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-purple-300 mb-2">Schedule Deleted!</h2>
                            <p className="text-gray-300 mb-6">{successMessage}</p>
                            <button 
                                onClick={() => setShowSuccessPopup(false)}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        
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