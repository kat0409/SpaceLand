import React, { useState } from "react";

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
        fetch(`${BACKEND_URL}/supervisor/HR/employee-names`)
            .then(res => res.json())
            .then(data => setEmployeeList(data))
            .catch(err => console.error("Failed to fetch employee names", err));
        fetch(`${BACKEND_URL}/supervisor/HR/get-departments`)
            .then(res => res.json())
            .then(data => setDepartmentList(data))
            .catch(err => console.error("Failed to fetch department names", err));
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
        const response = await fetch("/supervisor/HR/schedule", {
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
                {/* Employee dropdown */}
                <select
                    name="Employee Name"
                    value={form.EmployeeID}
                    onChange={handleChange}
                    required
                    className="p-2 rounded bg-black/50 text-white border border-gray-700"
                >
                    <option value="">Select Employee</option>
                    {employeeList.map((emp, idx) => (
                        <option key={idx} value={emp.EmployeeID}>
                            {emp.FullName}
                        </option>
                    ))}
                </select>

                {/* Department dropdown */}
                <select
                    name="Department"
                    value={form.Department}
                    onChange={handleChange}
                    required
                    className="p-2 rounded bg-black/50 text-white border border-gray-700"
                >
                    <option value="">Select Department</option>
                    {departmentList.map((dept, idx) => (
                        <option key={idx} value={dept.DepartmentName}>
                            {dept.DepartmentName}
                        </option>
                    ))}
                </select>

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
