import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://spaceland.onrender.com";

export default function EmployeeManagement(){
    const [employeeData, setEmployeeData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Address: "",
        SupervisorID: "",
        username: "",
        passord: "",
        Department: "",
        employmentStatus: true,
        dateOfBirth: "",
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        setEmployeeData((prev) => ({...prev, [name]: updatedValue}));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setMessage("");

        try{
            const res = await fetch(`${BACKEND_URL}/supervisor/HR/add-employee`, {
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(employeeData)
            });
            const data = await res.json();
            if(res.ok){
                setMessage('Employee added successfully!');
            }
            else{
                setMessage(`Error adding employee: ${data.error}`);
            }
        }
        catch(error){
            console.error(error);
            setMessage('Could not connect to the server');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-white bg-white/10 p-6 rounded-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-2">Add New Employee</h2>

            <input name="FirstName" value={formData.FirstName} onChange={handleChange} placeholder="First Name" className="input" required />
            <input name="LastName" value={formData.LastName} onChange={handleChange} placeholder="Last Name" className="input" required />
            <input name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" type="email" className="input" required />
            <input name="Address" value={formData.Address} onChange={handleChange} placeholder="Address" className="input" />
            <input name="SupervisorID" value={formData.SupervisorID} onChange={handleChange} placeholder="Supervisor ID" type="number" className="input" required />
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="input" required />
            <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" className="input" required />
            <input name="Department" value={formData.Department} onChange={handleChange} placeholder="Department" className="input" required />
            <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" className="input" required />

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="employmentStatus" checked={formData.employmentStatus} onChange={handleChange} />
                Active Employment
            </label>

            <button type="submit" className="w-full py-2 bg-purple-600 rounded-md hover:bg-purple-700">Add Employee</button>

            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
}