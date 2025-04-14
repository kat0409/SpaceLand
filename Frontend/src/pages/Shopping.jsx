import React, { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from '../components/AuthProvider';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function Shopping() {
    const [items, setItems] = useState([]);
    const { auth } = useContext(AuthContext);
    const isMerchandiseSupervisor = auth.isAuthenticated && auth.role === 'supervisor' && localStorage.getItem('department') === 'merchandise';

    useEffect(() => {
        fetch(`${BACKEND_URL}/get-merchandise`)
        .then(res => res.json())
        .then(setItems)
        .catch(err => console.error("Failed to load merchandise:", err));
    }, []);

    const handleEditClick = (itemId) => {
        // Navigate to MerchandiseSupervisorPortal with a query parameter
        window.location.href = `/supervisor/merchandise?editItem=${itemId}`;
    };

    return (
        <>
            <Header />
            <section className="min-h-screen bg-black text-white px-6 py-20">
                <h1 className="text-4xl font-bold text-center mb-12">🛍️ SpaceLand Merchandise</h1>
                
                {isMerchandiseSupervisor && (
                    <div className="max-w-4xl mx-auto mb-8 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                        <p className="text-purple-300 text-center">
                            You are logged in as a Merchandise Supervisor. Click on any item to edit its details or add an image.
                        </p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {Array.isArray(items) && items.length > 0 ? (
                    items.map(item => (
                    <div 
                        key={item.merchandiseID} 
                        className={`bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col ${isMerchandiseSupervisor ? 'cursor-pointer hover:bg-white/10' : ''}`}
                        onClick={isMerchandiseSupervisor ? () => handleEditClick(item.merchandiseID) : undefined}
                    >
                        <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-800 flex items-center justify-center">
                            {item.imageUrl ? (
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.itemName} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-500 flex items-center justify-center h-full w-full text-center p-4">
                                    <p>{isMerchandiseSupervisor ? "Click to add image" : "No image available"}</p>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold">{item.itemName}</h2>
                        <p className="text-purple-300 font-bold mb-2">
                            ${Number(item.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-auto">In Stock: {item.quantity}</p>
                    </div>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-400">No merchandise available.</p>
                )}
                </div>
            </section>
            <Footer />
        </>
    );      
}