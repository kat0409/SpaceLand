import React, { useState } from "react";

const ScheduleForm = ({ onScheduleAdded }) => {
    const [form, setForm] = useState({
        EmployeeID: "",
        Department: "",
        scheduleDate: "",
        shiftStart: "",
        shiftEnd: "",
        isRecurring: false,
    });

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
            <input type="number" name="EmployeeID" placeholder="Employee ID" value={form.EmployeeID} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />
            <input type="text" name="Department" placeholder="Department" value={form.Department} onChange={handleChange} required className="p-2 rounded bg-black/50 text-white border border-gray-700" />
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
