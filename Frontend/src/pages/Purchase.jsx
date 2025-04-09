// src/pages/Purchase.jsx
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingSection from '../components/PricingSection';
import Pricing from './Pricing';
import {useLocation} from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function Purchase() {
  const location = useLocation();
  const defaultTicket = location.state?.ticketType || 'General';

  const [ticketType, setTicketType] = useState(defaultTicket);
  const [mealPlan, setMealPlan] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const generalRestaurants = ['Galactic Grub', 'Rocket Bites', 'Nebula Noms'];
  const cosmicRestaurants = [...generalRestaurants, 'Stellar Snacks', 'Astro Appetites', 'Orbit Eats'];

  const handleTicketSelect = (type) => {
    setTicketType(type);
    setMealPlan('');
  };

  const handleMealSelect = (plan) => {
    setMealPlan(plan);
  };

  const handleTicketPurchase = async() => {
    const VisitorID = localStorage.getItem("VisitorID");
    const quantity = parseInt(ticketQuantity);
    const priceMap = {
      "General": 49.99,
      "Cosmic": 89.99
    };

    if (!VisitorID || !ticketType || !quantity || !priceMap[ticketType] || !mealPlan) return alert('Please select both ticket and meal plan.');
    alert(`✅ Purchase complete! Ticket: ${ticketType}, Meal Plan: ${mealPlan}`);

    const route = ticketType === "General" ? `${BACKEND_URL}/purchase-general-pass` : `${BACKEND_URL}/purchase-cosmic-pass`;

    try {
      const res = await fetch(route, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          VisitorID: VisitorID,
          quantity,
          price: priceMap[ticketType],
        }),
      });

      const data = await res.json();

      if(res.ok){
        alert(`Purchase successful! Transaction ID: ${data.transactionID}`);
      }
      else{
        alert(`Purchase was unsuccessful. Error:${data.error}`);
      }
    }
    catch (error){
      console.log("Error making transaction:",error);
      alert("Internal server error");
    }
  };
  
  const handleMealPlanPurchase =  async() => {
    const VisitorID = localStorage.getItem("VisitorID");
    const mealPlanName = mealPlan;
    const mealPlanPricing = {
      'General': 49.99,
      'Cosmic': 89.99
    }

    const price = mealPlanPricing[mealPlanName];

    if(!VisitorID || !mealPlanName || !price){
      return alert("Please select a valid meal plan");
    }

    try{
      const mealPlanID = mealPlanName === 'General' ? 1 : 2;

      const res = await fetch(`${BACKEND_URL}/meal-plan-purchase`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          VisitorID,
          mealPlanID
        }),
      });

      const data = await res.json();

      if(res.ok){
        alert(`Meal plan purchased successfully! Transaction ID: ${data.transactionID}`);
      }
      else{
        alert(`Meal plan purchase failed: ${data.error}`);
      }
    }
    catch(error){
      console.error("Error occurred while purchasing meal plan:", error);
      alert("Internal server error");
    }
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
            <div className="flex items-center gap-4">
              <label className="text-white font-medium">Quantity:</label>
              <input
                type="number"
                min="1"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity((Number(e.target.value)))}
                className="w-24 px-2 py-1 rounded-md text-white"
              />
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
                onClick={async() => {
                  await handleTicketPurchase();
                  await handleMealPlanPurchase();
                }}
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