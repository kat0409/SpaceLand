import { useState, useEffect } from 'react';

export default function ReorderForm() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/merchandise/items`)
        .then((res) => res.json())
        .then((data) => {
            if(Array.isArray(data)){ 
                setItems(data);
            }
            else{
                console.error("Unexpected response:", data);
                setItems([]);
            }
        })
        .catch((err) => {
            console.error('Error fetching merchandise:', err);
            setItems([]);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/reorders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            merchandiseID: selectedItem,
            quantityOrdered: quantity,
            expectedArrivalDate: expectedDate,
            notes
        }),
    });

        const data = await res.json();
        if (res.ok) {
            setMessage('Reorder placed');
            setSelectedItem('');
            setQuantity('');
            setExpectedDate('');
            setNotes('');
        } 
        else {
            setMessage(`${data.error || 'Failed to reorder.'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-lg">
        <h2 className="text-xl text-white font-bold">🔄 Reorder Merchandise</h2>

        <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            required
            className="w-full p-2 rounded bg-black text-white"
        >
            <option value="">Select Item</option>
            {items.map((item) => (
            <option key={item.merchandiseID} value={item.merchandiseID}>
                {item.itemName}
            </option>
            ))}
        </select>

        <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            required
            className="w-full p-2 rounded bg-black text-white"
        />

        <input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
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
            Submit Reorder
        </button>

        {message && <p className="text-green-400 mt-2">{message}</p>}
        </form>
    );
}