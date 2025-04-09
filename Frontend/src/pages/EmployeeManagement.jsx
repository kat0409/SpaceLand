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
        password: "",
        Department: "",
        employmentStatus: true,
        dateOfBirth: "",
    });
    const [supervisorNames, setSupervisorNames] = useState([]);
    const [departmentNames, setDepartmentNames] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/HR/get-supervisors`)
            .then(res => res.json())
            .then(data => setSupervisorNames(data))
            .catch(error => console.error('Failed to fetch supervisor names:', error));
    }, []);

    const handleChange = (e) => {
        const {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        setEmployeeData((prev) => ({...prev, [name]: updatedValue}));
    };

    const handleSupervisorEntry = (e) => {
        const selectedSupID = e.target.value;
        setEmployeeData(prev => ({...prev, SupervisorID: selectedSupID}));
    }

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

            <input name="FirstName" value={employeeData.FirstName} onChange={handleChange} placeholder="First Name" className="input" required />
            <input name="LastName" value={employeeData.LastName} onChange={handleChange} placeholder="Last Name" className="input" required />
            <input name="Email" value={employeeData.Email} onChange={handleChange} placeholder="Email" type="email" className="input" required />
            <input name="Address" value={employeeData.Address} onChange={handleChange} placeholder="Address" className="input" />
            
            <select name="SupervisorID" value={employeeData.SupervisorID} onChange={handleSupervisorEntry} className="input" required>
                <option value="">Select Supervisor</option>
                {supervisorNames.map(s => (
                    <option key={s.SupervisorID} value={s.SupervisorID}>
                        {s.FirstName} {s.LastName}
                    </option>
                ))}
            </select>

            <input name="username" value={employeeData.username} onChange={handleChange} placeholder="Username" className="input" required />
            <input name="password" value={employeeData.password} onChange={handleChange} placeholder="Password" type="password" className="input" required />
            <input name="Department" value={employeeData.Department} onChange={handleChange} placeholder="Department" className="input" required />
            <input name="dateOfBirth" value={employeeData.dateOfBirth} onChange={handleChange} type="date" className="input" required />

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="employmentStatus" checked={employeeData.employmentStatus} onChange={handleChange} />
                Active Employment
            </label>

            <button type="submit" className="w-full py-2 bg-purple-600 rounded-md hover:bg-purple-700">Add Employee</button>

            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
}