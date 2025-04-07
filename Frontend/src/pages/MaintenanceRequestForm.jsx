import { useState, useEffect } from "react"; //useEffect is used to display data

export default function MaintenanceRequestForm(){
    const [rides, setRides] = useState([]);//to have a dropdown menu that displays the list of rides
    const [employees, setEmployees] = useState([]);//to have a dropdown menu that displays the list of maintenance employees
    const [selectedRide, setSelectedRide] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [MaintenanceStartDate, setMaintenanceStartDate] = useState('');
    const [MaintenanceEndData, setMaintenanceEndDate] = useState('');
    const [message, setMessage] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/maintenance/rides`)
            .then(res => res.json())
            .then(data => setRides(data))
            .catch(err => console.error("Error fetching ride information:", err));
        fetch(`${BACKEND_URL}/supervisor/maintenance/employee-maintenance-request`)
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error("Error fetching employees:", err));
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const res = await fetch(`${BACKEND_URL}/supervisor/maintenance/maintenance-request`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                RideID: selectedRide,
                MaintenanceStartDate: MaintenanceStartDate,
                MaintenanceEndDate: MaintenanceEndData,
                MaintenanceEmployeeID: selectedEmployee
            })
        });

        const data = await res.json();
        if(res.ok){
            setMessage("Maintenance request successfully submitted");
            setSelectedRide('');
            setSelectedEmployee('');
            setMaintenanceStartDate('');
            setMaintenanceEndDate('');
        }
        else{
            setMessage(data.error || "Failed to submit maintenance request");
        }
    };
    return(
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-lg">
            <h2 className="text-xl text-white font-bold">🛠️ Submit Maintenance Request</h2>

            <select
                value={selectedRide}
                onChange={(e) => setSelectedRide(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            >
                <option value="">Select Ride</option>
                {rides.map(ride => (
                <option key={ride.RideID} value={ride.RideID}>
                    {ride.RideName}
                </option>
                ))}
            </select>

            <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            >
                <option value="">Select Maintenance Employee</option>
                {employees.map(emp => (
                <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FirstName} {emp.LastName}
                </option>
                ))}
            </select>

            <input
                type="date"
                value={MaintenanceStartDate}
                onChange={(e) => setMaintenanceStartDate(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            />

            <input
                type="date"
                value={MaintenanceEndData}
                onChange={(e) => setMaintenanceEndDate(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            />

            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
                Submit Request
            </button>

            {message && <p className="text-green-400 mt-2">{message}</p>}
        </form>
    );
}