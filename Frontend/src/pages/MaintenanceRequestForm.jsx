import { useState } from "react";

export default function MaintenanceRequestForm(){
    const [RideID, setRideID] = useState('');
    const [MainteanceStartDate, setMaintenanceStartDate] = useState('');
    const [MaintenanceEndDate, setMainetanceEndDate] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [message, setMessage] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

    useEffect(() => {
            fetch(`${BACKEND_URL}/supervisor/maintenance/maintenance-request`)
            .then((res) => res.json())
            .then((data) => {
                if(Array.isArray(data)){ 
                    setReorders(data);
                }
                else{
                    console.error("Unexpected response:", data);
                    setReorders([]);
                }
            })
            .catch((err) => {
                console.error('Error fetching merchandise:', err);
                setReorders([]);
            });
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reorder = reorders.find(r => r.reorderID === parseInt(selectedReorder));
        const merchandiseID = reorder?.merchandiseID;
        if(!reorder){
            return setMessage("Invalid reorder selected");
        }

        const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/stock-arrivals`, {   
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reorderID: reorder.reorderID,
                merchandiseID: merchandiseID,
                quantityAdded: quantity,
                arrivalDate: arrivalDate,
                notes
            }),
        });

        const data = await res.json();

        setMessage(data.message || 'Unexpected behavior');
        if(res.ok){
            setSelectedReorder('');
            setQuantity('');
            setNotes('');
            setArrivalDate('');
        }
    };
}