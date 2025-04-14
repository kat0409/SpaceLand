import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

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
            alert("Schedule added successfully!");
            setForm({ EmployeeID: "", Department: "", scheduleDate: "", shiftStart: "", shiftEnd: "", isRecurring: false });
            onScheduleAdded(); // Trigger refresh in parent
        } else {
            alert(result.error || "Failed to add schedule.");
        }
    };

    return (
        <div className="bg-white/10 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Create Employee Shift</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Employee Dropdown */}
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
                {/* Department Display (auto-filled) */}
                <input
                    type="text"
                    name="Department"
                    value={form.Department}
                    readOnly
                    className="p-2 rounded bg-black/30 text-white border border-gray-700"
                />

                <input type="date" name="scheduleDate" value={form.scheduleDate} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />
                <input type="time" name="shiftStart" value={form.shiftStart} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />
                <input type="time" name="shiftEnd" value={form.shiftEnd} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />

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
