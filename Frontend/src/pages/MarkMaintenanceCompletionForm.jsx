import {useState, useEffect} from "react";

export default function MarkMaintenanceCompletionForm(){
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/maintenance/ridemaintenance-pending`)
            .then(res => res.json())
            .then(data => setRequests(data))
            .catch(err => console.error("Error fetching pending maintenance requests:", err));
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${BACKEND_URL}/supervisor/maintenance/complete-request`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                maintenanceID: selectedRequest,
                MaintenanceEndDate: endDate
            })
        });

        const data = await res.json();

        if(res.ok){
            setMessage("Maintenance marked as complete.");
            setSelectedRequest('');
            setEndDate('');
        }
        else{
            setMessage(data.error || "Failed to complete maintenance.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-lg">
            <h2 className="text-xl text-white font-bold">✅ Mark Maintenance as Completed</h2>

            <select
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            >
                <option value="">Select Pending Request</option>
                {requests.map(req => (
                <option key={req.maintenanceID} value={req.maintenanceID}>
                    {req.RideName} - ID {req.maintenanceID}
                </option>
                ))}
            </select>

            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            />

            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                Complete Maintenance
            </button>

            {message && <p className="text-green-400 mt-2">{message}</p>}
        </form>
    );
}
