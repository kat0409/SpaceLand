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
    
    const
}
