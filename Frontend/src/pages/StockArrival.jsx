import { useState, useEffect } from 'react';

export default function StockArrivalForm(){
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
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

        const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/stock-arrivals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            merchandiseID: selectedItem,
            quantityAdded: quantity,
            arrivalDate: arrivalDate,
            reorderID: 
            notes
        }),
    });
};