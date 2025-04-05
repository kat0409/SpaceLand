import { useState, useEffect } from 'react';

export default function StockArrivalForm(){
    const [reorders, setReorders] = useState([]);
    const [selectedReorder, setSelectedReorder] = useState('');
    const [quantity, setQuantity] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/merchandise/reorders`)
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
        if(!reorder){
            return setMessage("Invalid reorder selected");
        }

        const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/stock-arrivals`, {   
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                merchandiseID: reorder.merchandiseID,
                quantityAdded: quantity,
                arrivalDate: arrivalDate,
                reorderID: reorder.reorderID,
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-lg">
            <h2 className="text-xl text-white font-bold">📦 Record Stock Arrival</h2>
        
            <select
                value={selectedReorder}
                onChange={(e) => setSelectedReorder(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            >
                <option value="">Select Reorder</option>
                {reorders.map((r) => (
                <option key={r.reorderID} value={r.reorderID}>
                    {r.itemName} – Qty: {r.quantityOrdered}
                </option>
                ))}
            </select>
        
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity Arrived"
                required
                className="w-full p-2 rounded bg-black text-white"
            />
        
            <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                required
                className="w-full p-2 rounded bg-black text-white"
            />
        
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full p-2 rounded bg-black text-white"
            />
        
            <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
                Mark Stock Arrival
            </button>
        
            {message && <p className="text-green-400 mt-2">{message}</p>}
        </form>
    );
};