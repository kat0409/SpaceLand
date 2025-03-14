// src/pages/Purchase.jsx
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Purchase() {
  const [ticketType, setTicketType] = useState('');
  const [mealPlan, setMealPlan] = useState('');

  const generalRestaurants = ['Galactic Grub', 'Rocket Bites', 'Nebula Noms'];
  const cosmicRestaurants = [...generalRestaurants, 'Stellar Snacks', 'Astro Appetites', 'Orbit Eats'];

  const handleTicketSelect = (type) => {
    setTicketType(type);
    setMealPlan('');
  };

  const handleMealSelect = (plan) => {
    setMealPlan(plan);
  };

  const handlePurchase = () => {
    if (!ticketType || !mealPlan) return alert('Please select both ticket and meal plan.');
    alert(`✅ Purchase complete! Ticket: ${ticketType}, Meal Plan: ${mealPlan}`);
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl font-bold text-center mb-6">🎟️ Purchase Tickets</h2>

          {/* Step 1 - Ticket Type */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Step 1: Select Ticket Type</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => handleTicketSelect('General')}
                className={`flex-1 py-3 rounded-lg text-white font-semibold border ${ticketType === 'General' ? 'bg-purple-600 border-purple-500' : 'bg-gray-800 border-white/10'} transition`}
              >
                General Admission
              </button>
              <button
                onClick={() => handleTicketSelect('Cosmic')}
                className={`flex-1 py-3 rounded-lg text-white font-semibold border ${ticketType === 'Cosmic' ? 'bg-purple-600 border-purple-500' : 'bg-gray-800 border-white/10'} transition`}
              >
                Cosmic Admission
              </button>
            </div>
          </div>

          {/* Step 2 - Meal Plan */}
          {ticketType && (
            <div className="bg-white/10 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Step 2: Choose Meal Plan</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => handleMealSelect('General Meal Plan')}
                  className={`flex-1 py-3 rounded-lg text-white font-semibold border ${mealPlan === 'General Meal Plan' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-white/10'} transition`}
                >
                  General Meal Plan
                </button>
                <button
                  onClick={() => handleMealSelect('Cosmic Meal Plan')}
                  className={`flex-1 py-3 rounded-lg text-white font-semibold border ${mealPlan === 'Cosmic Meal Plan' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-white/10'} transition`}
                >
                  Cosmic Meal Plan
                </button>
              </div>

              {/* Show Restaurants */}
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">🍽 Included Restaurants:</h4>
                <ul className="list-disc list-inside text-gray-300">
                  {(mealPlan === 'Cosmic Meal Plan' ? cosmicRestaurants : generalRestaurants).map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Step 3 - Confirm Purchase */}
          {ticketType && mealPlan && (
            <div className="text-center">
              <button
                onClick={handlePurchase}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-600 transition"
              >
                Confirm Purchase
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}