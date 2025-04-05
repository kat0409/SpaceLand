import { useState, useEffect } from 'react';

export default function StockArrivalForm(){
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantityAdded, setQuantityAdded] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';


};