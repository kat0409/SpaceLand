import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function Shopping() {
    const [merchandise, setMerchandise] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const visitorID = localStorage.getItem('VisitorID');
        if (!visitorID) {
            alert('Please log in to shop for merchandise');
            navigate('/auth');
        }
    }, [navigate]);

    // Fetch merchandise data
    useEffect(() => {
        fetch(`${BACKEND_URL}/get-merchandise`)
        .then(res => res.json())
        .then(data => {
            setMerchandise(data);
            setIsLoading(false);
        })
        .catch(err => {
            console.error('Error fetching merchandise:', err);
            setIsLoading(false);
        });
    }, []);

    // Add item to cart
    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.merchandiseID === item.merchandiseID);
        
        if (existingItem) {
            // Increase quantity if already in cart
            setCart(cart.map(cartItem => 
                cartItem.merchandiseID === item.merchandiseID 
                    ? {...cartItem, quantity: cartItem.quantity + 1} 
                    : cartItem
            ));
        } else {
            // Add new item to cart
            setCart([...cart, {...item, quantity: 1}]);
        }
        
        // Show cart briefly
        setShowCart(true);
        setTimeout(() => setShowCart(false), 3000);
    };

    // Remove item from cart
    const removeFromCart = (merchandiseID) => {
        setCart(cart.filter(item => item.merchandiseID !== merchandiseID));
    };

    // Update item quantity
    const updateQuantity = (merchandiseID, quantity) => {
        if (quantity < 1) return;
        
        setCart(cart.map(item => 
            item.merchandiseID === merchandiseID 
                ? {...item, quantity} 
                : item
        ));
    };

    // Calculate total price
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Handle checkout
    const handleCheckout = async () => {
        const visitorID = localStorage.getItem('VisitorID');
        
        if (!visitorID) {
            alert('Please log in to complete your purchase');
            navigate('/auth');
            return;
        }
        
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        // Prepare cart items for the API
        const items = cart.map(item => ({
            merchandiseID: item.merchandiseID,
            quantity: item.quantity
        }));
        
        try {
            const response = await fetch(`${BACKEND_URL}/online-merchandise-purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorID, items })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Purchase successful! Thank you for your order.');
                setCart([]);
                navigate('/portal'); // Redirect to user portal
            } else {
                alert(`Error: ${data.error || 'Failed to complete purchase'}`);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('An error occurred during checkout. Please try again.');
        }
    };

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
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">SpaceLand Shop</h1>
                        
                        <button 
                            onClick={() => setShowCart(!showCart)}
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full flex items-center"
                        >
                            <span className="mr-2">🛒</span>
                            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
                        </button>
                    </div>
                    
                    {/* Shopping Cart Slide-in */}
                    <div className={`fixed right-0 top-0 h-full w-80 bg-gray-900 p-4 shadow-lg transform transition-transform z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Cart</h2>
                            <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        
                        {cart.length === 0 ? (
                            <p className="text-gray-400">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="space-y-4 mb-4 max-h-[70vh] overflow-y-auto">
                                    {cart.map(item => (
                                        <div key={item.merchandiseID} className="flex justify-between items-center border-b border-gray-700 pb-2">
                                            <div>
                                                <p className="font-medium">{item.itemName}</p>
                                                <p className="text-sm text-gray-400">${item.price} each</p>
                                            </div>
                                            <div className="flex items-center">
                                                <button 
                                                    onClick={() => updateQuantity(item.merchandiseID, item.quantity - 1)} 
                                                    className="px-2 bg-gray-800 rounded-l"
                                                >-</button>
                                                <span className="px-2 bg-gray-800">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.merchandiseID, item.quantity + 1)} 
                                                    className="px-2 bg-gray-800 rounded-r"
                                                >+</button>
                                                <button 
                                                    onClick={() => removeFromCart(item.merchandiseID)} 
                                                    className="ml-2 text-red-400 hover:text-red-300"
                                                >🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pt-4">
                                    <div className="flex justify-between mb-4">
                                        <span>Total:</span>
                                        <span className="font-bold">${calculateTotal()}</span>
                                    </div>
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-white font-medium"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {isLoading ? (
                        <div className="flex justify-center my-12">
                            <p className="text-xl">Loading merchandise...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {merchandise.map(item => (
                                <div key={item.merchandiseID} className="bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                                    <div className="h-48 bg-gray-800 flex items-center justify-center">
                                        {item.imageUrl ? (
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.itemName} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-5xl">🚀</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold mb-1">{item.itemName}</h3>
                                        <p className="text-gray-400 text-sm mb-2">{item.giftShopName}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold">${item.price}</span>
                                            <button 
                                                onClick={() => addToCart(item)}
                                                disabled={item.quantity < 1}
                                                className={`px-3 py-1 rounded ${
                                                    item.quantity < 1 
                                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-purple-600 hover:bg-purple-700'
                                                }`}
                                            >
                                                {item.quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                        {item.quantity <= 10 && item.quantity > 0 && (
                                            <p className="text-yellow-500 text-sm mt-1">Only {item.quantity} left in stock!</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );      
}