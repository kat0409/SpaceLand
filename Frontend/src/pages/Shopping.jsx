import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../components/AuthProvider";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function Shopping() {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch(`${BACKEND_URL}/get-merchandise`)
        .then(res => res.json())
        .then(setItems)
        .catch(err => console.error("Failed to load merchandise:", err));
    }, []);

    // Add an item to cart
    const addToCart = (item) => {
        setError('');
        
        if (!auth.isAuthenticated || auth.role !== 'visitor') {
            setError('Please log in as a visitor to make a purchase');
            return;
        }
        
        const existingItem = cart.find(cartItem => cartItem.merchandiseID === item.merchandiseID);
        
        if (existingItem) {
            setCart(cart.map(cartItem => 
                cartItem.merchandiseID === item.merchandiseID 
                ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
        
        setSuccess(`${item.itemName} added to cart!`);
        setTimeout(() => setSuccess(''), 2000);
    };

    // Remove an item from cart
    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.merchandiseID !== itemId));
    };

    // Update item quantity in cart
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setCart(cart.map(item => 
            item.merchandiseID === itemId 
            ? { ...item, quantity: newQuantity } 
            : item
        ));
    };

    // Calculate total price
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Process checkout
    const handleCheckout = async () => {
        if (!auth.isAuthenticated || auth.role !== 'visitor') {
            setError('Please log in as a visitor to make a purchase');
            return;
        }
        
        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }
        
        // Store cart in localStorage for the payment page
        localStorage.setItem('merchandiseCart', JSON.stringify(cart));
        
        // Navigate to payment page
        navigate('/payment-form');
    };

    return (
        <>
            <Header />
            <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
                {/* Featured Gift Shop Section */}
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">🚀 SpaceLand Shopping</h1>
                    
                    {/* Authentication warning */}
                    {(!auth.isAuthenticated || auth.role !== 'visitor') && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 text-center">
                            <p>Please <a href="/auth" className="text-purple-400 hover:text-purple-300">log in as a visitor</a> to purchase merchandise</p>
                        </div>
                    )}
                    
                    {/* Error and success messages */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 text-center">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-8 text-center">
                            <p>{success}</p>
                        </div>
                    )}
                    
                    {/* Shopping Cart Summary (if items exist) */}
                    {cart.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6 mb-8"
                        >
                            <h2 className="text-2xl font-bold mb-4">🛒 Your Shopping Cart</h2>
                            <div className="space-y-3 mb-4">
                                {cart.map(item => (
                                    <div key={item.merchandiseID} className="flex justify-between items-center border-b border-white/10 pb-3">
                                        <div>
                                            <h3 className="font-semibold">{item.itemName}</h3>
                                            <p className="text-sm text-purple-300">${Number(item.price).toFixed(2)} each</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => updateQuantity(item.merchandiseID, item.quantity - 1)}
                                                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.merchandiseID, item.quantity + 1)}
                                                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                            <button 
                                                onClick={() => removeFromCart(item.merchandiseID)}
                                                className="ml-3 text-red-400 hover:text-red-300"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t border-white/20 pt-3">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={!auth.isAuthenticated || auth.role !== 'visitor'}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Proceed to Checkout
                            </button>
                        </motion.div>
                    )}
                    
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
                    
                    {/* Merchandise Section */}
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
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">
                                    {item.quantity > 20 ? 
                                        <span className="text-green-400">In Stock</span> : 
                                        item.quantity > 0 ? 
                                        <span className="text-yellow-400">Limited Stock</span> : 
                                        <span className="text-red-400">Out of Stock</span>
                                    }
                                </p>
                                <button
                                    onClick={() => addToCart(item)}
                                    disabled={!auth.isAuthenticated || auth.role !== 'visitor' || item.quantity <= 0}
                                    className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to Cart
                                </button>
                            </div>
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