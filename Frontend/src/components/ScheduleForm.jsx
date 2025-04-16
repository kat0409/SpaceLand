import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

const ScheduleForm = ({ onScheduleAdded }) => {
    const [form, setForm] = useState({
        EmployeeID: "",
        Department: "",
        scheduleDate: "",
        shiftStart: "",
        shiftEnd: "",
        isRecurring: false,
    });
    const [employeeList, setEmployeeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/HR/all-employee-names`)
            .then(res => res.json())
            .then(data => setEmployeeList(data))
            .catch(err => console.error("Failed to fetch employee names", err));
    }, []);    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${BACKEND_URL}/supervisor/HR/schedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const result = await response.json();
        if (response.ok) {
            // Get employee name for the success message
            const employee = employeeList.find(emp => emp.EmployeeID === form.EmployeeID);
            const employeeName = employee ? `${employee.FirstName} ${employee.LastName}` : `Employee #${form.EmployeeID}`;
            
            // Format the date for a more readable success message
            const shiftDate = new Date(form.scheduleDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            setSuccessMessage(`Shift scheduled for ${employeeName} on ${shiftDate} from ${form.shiftStart} to ${form.shiftEnd}`);
            setShowSuccessPopup(true);
            
            // Auto-hide popup after 3 seconds
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 3000);
            
            setForm({ EmployeeID: "", Department: "", scheduleDate: "", shiftStart: "", shiftEnd: "", isRecurring: false });
            onScheduleAdded(); // Trigger refresh in parent
        } else {
            alert(result.error || "Failed to add schedule.");
        }
    };

    return (
        <div className="bg-white/10 p-4 rounded-xl relative">
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
                            <h2 className="text-2xl font-bold text-purple-300 mb-2">Shift Added!</h2>
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

            <h2 className="text-lg font-semibold mb-2">Create Employee Shift</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Employee Dropdown */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Select Employee</label>
                    <select
                    name="EmployeeID"
                    value={form.EmployeeID}
                    onChange={async (e) => {
                        const selectedID = e.target.value;
                        setForm(prev => ({ ...prev, EmployeeID: selectedID }));

                        // Fetch department automatically
                        try {
                        const res = await fetch(`${BACKEND_URL}/supervisor/HR/get-employee-department?EmployeeID=${selectedID}`);
                        const data = await res.json();
                        if (res.ok && data.Department) {
                            setForm(prev => ({ ...prev, Department: data.Department }));
                        } else {
                            setForm(prev => ({ ...prev, Department: '' }));
                        }
                        } catch (err) {
                            console.error("Failed to fetch department", err);
                            setForm(prev => ({ ...prev, Department: '' }));
                        }
                    }}
                    className="p-2 rounded bg-black/50 text-white border border-gray-700"
                    required
                    >
                    <option value="">-- Choose an employee --</option>
                    {employeeList.map(emp => (
                        <option key={emp.EmployeeID} value={emp.EmployeeID}>
                        {emp.FirstName} {emp.LastName}
                        </option>
                    ))}
                </select>
                </div>

                {/* Department Display (auto-filled) */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Department</label>
                    <input
                        type="text"
                        name="Department"
                        value={form.Department}
                        readOnly
                        className="p-2 rounded bg-black/30 text-white border border-gray-700"
                    />
                </div>

                {/* Date field */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Shift Date</label>
                    <input type="date" name="scheduleDate" value={form.scheduleDate} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />
                </div>

                {/* Start Time field */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">Start Time</label>
                    <input type="time" name="shiftStart" value={form.shiftStart} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />
                </div>

                {/* End Time field */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">End Time</label>
                    <input type="time" name="shiftEnd" value={form.shiftEnd} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />
                </div>

                <label className="flex items-center text-white space-x-2">
                    <input type="checkbox" name="isRecurring" checked={form.isRecurring} onChange={handleChange} />
                    <span>Recurring Shift?</span>
                </label>

                <button type="submit" className="col-span-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white mt-2">
                    Add Schedule
                </button>
            </form>
        </div>
    );
};

export default ScheduleForm;