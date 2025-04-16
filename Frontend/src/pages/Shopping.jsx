import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function Shopping() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/get-merchandise`)
        .then(res => res.json())
        .then(setItems)
        .catch(err => console.error("Failed to load merchandise:", err));
    }, []);

    return (
        <>
            <Header />
            <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
                {/* Featured Gift Shop Section */}
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">🚀 SpaceLand Shopping</h1>
                    
                    <div className="bg-white/10 rounded-2xl overflow-hidden p-6 mb-16">
                        <h2 className="text-3xl font-bold text-center mb-6 text-purple-300">Andromeda Galaxy Gift Shop</h2>
                        
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/2">
                                <img 
                                    src="/assets/AndromedaGalaxyGiftShop.jpg" 
                                    alt="Andromeda Galaxy Gift Shop" 
                                    className="rounded-xl w-full h-auto shadow-lg" 
                                />
                            </div>
                            
                            <div className="md:w-1/2">
                                <p className="text-lg mb-4">
                                    The Andromeda Galaxy Gift Shop features a stellar selection of out-of-this-world merchandise and souvenirs for your shopping pleasure!
                                </p>
                                <p className="mb-4">
                                    Don't miss out with our on-trend space-themed selections, toys and novelties, family necessities and a variety of cosmic brands including:
                                </p>
                                <p className="font-bold text-purple-200 mb-4">
                                    Space Explorers™, Stellar Couture, Cosmic Collectibles, Nebula Novelties, Galaxy Gear and more!
                                </p>
                                
                                <div className="mt-6 text-sm text-gray-300">
                                    <p>All retail stores are located adjacent to the SpaceLand Central Hub unless noted.</p>
                                    <p>Hours vary and are seasonal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Original Merchandise Section */}
                    <h2 className="text-3xl font-bold text-center mb-8">🛍️ Available Merchandise</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Array.isArray(items) && items.length > 0 ? (
                        items.map(item => (
                        <div key={item.merchandiseID} className="bg-white/5 p-5 rounded-lg border border-white/10 transition-all hover:bg-white/10 hover:shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">{item.itemName}</h3>
                            <p className="text-purple-300 font-bold mb-3">
                            ${Number(item.price).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">Shop: {item.giftShopName || 'Andromeda Galaxy'}</p>
                            <p className="text-sm text-gray-500">
                                {item.quantity > 20 ? 
                                    <span className="text-green-400">In Stock</span> : 
                                    item.quantity > 0 ? 
                                    <span className="text-yellow-400">Limited Stock</span> : 
                                    <span className="text-red-400">Out of Stock</span>
                                }
                            </p>
                        </div>
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-400">No merchandise available.</p>
                    )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );      
}