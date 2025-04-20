// src/pages/Purchase.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { AuthContext } from '../components/AuthProvider';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

const TICKET_TYPES = {
  General: {
    price: 49.99,
    description: 'Access to all general attractions and rides',
    restaurants: ['Galactic Grub', 'Rocket Bites', 'Nebula Noms']
  },
  Cosmic: {
    price: 89.99,
    description: 'VIP access to all attractions, including exclusive Cosmic rides',
    restaurants: ['Galactic Grub', 'Rocket Bites', 'Nebula Noms', 'Stellar Snacks', 'Astro Appetites', 'Orbit Eats']
  }
};

const MEAL_PLANS = {
  'General Meal Plan': {
    price: 49.99,
    description: 'Access to general dining options',
    restaurants: TICKET_TYPES.General.restaurants
  },
  'Cosmic Meal Plan': {
    price: 89.99,
    description: 'Access to all dining options including premium restaurants',
    restaurants: TICKET_TYPES.Cosmic.restaurants
  }
};

export default function Purchase() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ticketType, setTicketType] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const handleTicketSelect = (type) => {
    setTicketType(type);
    setMealPlan(null);
    setError('');
    setSuccess('');
  };

  const handleMealSelect = (plan) => {
    setMealPlan(plan);
    setError('');
    setSuccess('');
  };

  const validatePurchase = () => {
    if (!auth.isAuthenticated || auth.role !== 'visitor') {
      setError('Please log in as a visitor to make a purchase');
      return false;
    }
    if (!ticketType) {
      setError('Please select a ticket type');
      return false;
    }
    if (!mealPlan) {
      setError('Please select a meal plan');
      return false;
    }
    if (ticketQuantity < 1) {
      setError('Please select at least one ticket');
      return false;
    }
    return true;
  };

  const handlePurchase = async () => {
    if (!validatePurchase()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const visitorID = localStorage.getItem("VisitorID");
      console.log("VisitorID from localStorage:", visitorID);
      
      if (!visitorID) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      // Purchase tickets
      const ticketEndpoint = `${BACKEND_URL}/purchase-${ticketType.toLowerCase()}-pass`;
      console.log('Making ticket purchase request to:', ticketEndpoint);
      
      const ticketPayload = {
        VisitorID: visitorID,
        quantity: ticketQuantity,
        price: TICKET_TYPES[ticketType].price
      };
      console.log('With payload:', ticketPayload);
      
      try {
        const ticketResponse = await fetch(
          ticketEndpoint,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketPayload)
          }
        );
        
        // Log the raw response
        console.log('Ticket response status:', ticketResponse.status);
        console.log('Ticket response OK:', ticketResponse.ok);
        
        // Check for network errors
        if (!ticketResponse) {
          throw new Error('Network error. Please try again later.');
        }

        const ticketData = await ticketResponse.json();
        console.log('Ticket purchase response data:', ticketData);

        if (!ticketResponse.ok) {
          throw new Error(ticketData.error || `Failed to purchase tickets (Status: ${ticketResponse.status})`);
        }
        
        // Purchase meal plan
        const mealPlanEndpoint = `${BACKEND_URL}/meal-plan-purchase`;
        console.log('Making meal plan purchase request to:', mealPlanEndpoint);
        
        const mealPlanPayload = {
          VisitorID: visitorID,
          mealPlanID: mealPlan === 'General Meal Plan' ? 1 : 2
        };
        console.log('With payload:', mealPlanPayload);

        const mealPlanResponse = await fetch(mealPlanEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mealPlanPayload)
        });
        
        // Log the raw response
        console.log('Meal plan response status:', mealPlanResponse.status);
        console.log('Meal plan response OK:', mealPlanResponse.ok);

        // Check for network errors
        if (!mealPlanResponse) {
          throw new Error('Network error. Please try again later.');
        }

        const mealPlanData = await mealPlanResponse.json();
        console.log('Meal plan purchase response data:', mealPlanData);

        if (!mealPlanResponse.ok) {
          throw new Error(mealPlanData.error || `Failed to purchase meal plan (Status: ${mealPlanResponse.status})`);
        }

        // Success! Show message and redirect
        setSuccess('Purchase successful! Redirecting to your portal...');
        
        // Store transaction IDs in localStorage for reference
        if (ticketData.transactionID) {
          localStorage.setItem('lastTicketTransactionID', ticketData.transactionID);
        }
        if (mealPlanData.transactionID) {
          localStorage.setItem('lastMealPlanTransactionID', mealPlanData.transactionID);
        }
        
        // Redirect to user portal after successful purchase
        setTimeout(() => {
          navigate('/payment-form');
        }, 1500);
      } catch (fetchError) {
        console.error('API request failed:', fetchError);
        setError(fetchError.message || 'Failed to communicate with the server');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err.message || 'An error occurred during the purchase process');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!ticketType) return 0;
    const ticketTotal = TICKET_TYPES[ticketType].price * ticketQuantity;
    const mealPlanTotal = mealPlan ? MEAL_PLANS[mealPlan].price : 0;
    return ticketTotal + mealPlanTotal;
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-6"
          >
            🎟️ Purchase Your Space Adventure
          </motion.h2>

          {(!auth.isAuthenticated || auth.role !== 'visitor') && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
              <p>Please <a href="/auth" className="text-purple-400 hover:text-purple-300">log in as a visitor</a> to make a purchase</p>
            </div>
          )}

          {/* Step 1 - Ticket Type */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 p-6 rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-4">Step 1: Select Ticket Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(TICKET_TYPES).map(([type, details]) => (
                <button
                  key={type}
                  onClick={() => handleTicketSelect(type)}
                  disabled={!auth.isAuthenticated || auth.role !== 'visitor'}
                  className={`p-4 rounded-lg text-left transition ${
                    ticketType === type
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-gray-800 border-white/10 hover:bg-gray-700'
                  } border`}
                >
                  <h4 className="text-lg font-semibold mb-2">{type} Pass</h4>
                  <p className="text-2xl font-bold mb-2">${details.price}</p>
                  <p className="text-sm text-gray-300 mb-2">{details.description}</p>
                  <ul className="text-xs text-gray-400">
                    {details.restaurants.map((restaurant, idx) => (
                      <li key={idx}>• {restaurant}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            {ticketType && (
              <div className="mt-4 flex items-center gap-4">
                <label className="text-white font-medium">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-2 rounded-md bg-gray-800 text-white border border-white/10"
                />
              </div>
            )}
          </motion.div>

          {/* Step 2 - Meal Plan */}
          {ticketType && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-4">Step 2: Choose Meal Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(MEAL_PLANS).map(([plan, details]) => (
                  <button
                    key={plan}
                    onClick={() => handleMealSelect(plan)}
                    disabled={!auth.isAuthenticated || auth.role !== 'visitor'}
                    className={`p-4 rounded-lg text-left transition ${
                      mealPlan === plan
                        ? 'bg-indigo-600 border-indigo-500'
                        : 'bg-gray-800 border-white/10 hover:bg-gray-700'
                    } border`}
                  >
                    <h4 className="text-lg font-semibold mb-2">{plan}</h4>
                    <p className="text-2xl font-bold mb-2">${details.price}</p>
                    <p className="text-sm text-gray-300 mb-2">{details.description}</p>
                    <ul className="text-xs text-gray-400">
                      {details.restaurants.map((restaurant, idx) => (
                        <li key={idx}>• {restaurant}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3 - Summary & Purchase */}
          {ticketType && mealPlan && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-4">Step 3: Review & Purchase</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Ticket Type:</span>
                  <span className="font-semibold">{ticketType} Pass</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Quantity:</span>
                  <span className="font-semibold">{ticketQuantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Meal Plan:</span>
                  <span className="font-semibold">{mealPlan}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                  {success}
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={loading || !auth.isAuthenticated || auth.role !== 'visitor'}
                className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
                  loading || !auth.isAuthenticated || auth.role !== 'visitor'
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600'
                }`}
              >
                {loading ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </motion.div>
          )}

          {/* New merchandise shopping section */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6 mt-12">
            <h3 className="text-xl font-semibold mb-2">🛍️ Looking for SpaceLand Merchandise?</h3>
            <p className="mb-4">
              Check out our space-themed merchandise collection at the Andromeda Galaxy Gift Shop! 
              From t-shirts to collectibles, we have everything you need to remember your cosmic adventure.
            </p>
            <Link 
              to="/shopping" 
              className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-bold text-white transition-all"
            >
              Visit Gift Shop
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}