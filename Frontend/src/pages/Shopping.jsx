import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function Shopping() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/get-merchandise`)
        .then(res => res.json())
        .then(setItems)
        .catch(err => console.error("Failed to load merchandise:", err));
    }, []);

    return (
        <section className="min-h-screen bg-black text-white px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">🛍️ SpaceLand Merchandise</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.isArray(items) && items.length > 0 ? (
                items.map(item => (
                    <div key={item.merchandiseID} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h2 className="text-xl font-semibold">{item.itemName}</h2>
                    <p className="text-purple-300 font-bold mb-2">${Number(item.price).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">In Stock: {item.quantity}</p>
                    </div>
                ))
                ) : (
                <p className="text-center col-span-full text-gray-400">No merchandise available.</p>
            )}
        </div>
        </section>
    );
}
