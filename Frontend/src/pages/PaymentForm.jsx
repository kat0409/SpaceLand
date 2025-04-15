import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../components/AuthProvider';
import { useContext } from 'react';

export default function PaymentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderSummary = location.state?.orderSummary;

  if (!orderSummary) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">No Order Selected</h2>
            <p className="text-gray-400 mb-6">Please select your tickets and meal plan first.</p>
            <a 
              href="/purchase" 
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Return to Purchase Page
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    address: ''
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { auth } = useContext(AuthContext);
    const visitorID = localStorage.getItem('VisitorID');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create ticket record
      const ticketResponse = await fetch(`${BACKEND_URL}/create-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorID,
          ticketType: orderSummary.ticketType,
          quantity: orderSummary.ticketQuantity,
          totalAmount: orderSummary.ticketTotal,
          transactionDate: new Date().toISOString()
        })
      });

      if (!ticketResponse.ok) {
        throw new Error('Failed to create ticket record');
      }

      // If meal plan was selected, create meal plan record
      if (orderSummary.mealPlan) {
        const mealPlanResponse = await fetch(`${BACKEND_URL}/create-meal-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitorID,
            mealPlanType: orderSummary.mealPlan,
            totalAmount: orderSummary.mealPlanTotal,
            transactionDate: new Date().toISOString()
          })
        });

        if (!mealPlanResponse.ok) {
          throw new Error('Failed to create meal plan record');
        }
      }

      setMessage('Payment successful! Redirecting to your portal...');
      
      // Redirect after successful payment
      setTimeout(() => {
        navigate('/userportal');
      }, 2000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 p-8 rounded-xl border border-white/10">
            <h2 className="text-3xl font-bold mb-6">💳 Payment Information</h2>
            
            <div className="mb-8 p-4 bg-white/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{orderSummary.ticketType} Pass x{orderSummary.ticketQuantity}</span>
                  <span>${orderSummary.ticketTotal.toFixed(2)}</span>
                </div>
                {orderSummary.mealPlan && (
                  <div className="flex justify-between">
                    <span>{orderSummary.mealPlan}</span>
                    <span>${orderSummary.mealPlanTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Billing Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Space Street, Houston, TX 77001"
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10"
                  required
                />
              </div>

              {message && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600'
                }`}
              >
                {loading ? 'Processing...' : `Pay $${orderSummary.total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
} 