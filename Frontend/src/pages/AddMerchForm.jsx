import { useState } from "react";

export default function AddMerchandiseForm(){
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://spacelandmark.onrender.com";

    const handleSubmit = async(e) => {
        e.preventDefault();

        const res = await fetch(`${BACKEND_URL}/supervisor/merchandise/add-merch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemName, price, quantity }),
        });

        const data = await res.json();

        setMessage(data.message || data.error || "Unexpected behavior");

        if(res.ok){
            setItemName("");
            setPrice("");
            setQuantity("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-lg mt-8">
            <h2 className="text-xl font-bold text-white">➕ Add New Merchandise</h2>
            <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeHolder="Item Name"
                required
                className="w-full p-2 rounded bg-black text-white"
            />
            <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                required
                className="w-full p-2 rounded bg-black text-white"
            />
            <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                required
                className="w-full p-2 rounded bg-black text-white"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                Add Item
            </button>
            {message && <p className="text-green-400 mt-2">{message}</p>}
        </form>
    );
}