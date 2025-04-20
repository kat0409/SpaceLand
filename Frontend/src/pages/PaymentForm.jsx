import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function PaymentForm() {
  const [form, setForm] = useState({
    CardType: "",
    CardNumber: "",
    CVV: "",
    CardholderName: "",
    ExpiryDate: "",
    BillingAddress: ""
  });
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [merchandiseCart, setMerchandiseCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    itemCount: 0,
    totalAmount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a merchandise cart in localStorage
    const savedCart = localStorage.getItem('merchandiseCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setMerchandiseCart(parsedCart);
      
      // Calculate order summary
      const itemCount = parsedCart.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = parsedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      setOrderSummary({
        itemCount,
        totalAmount
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const VisitorID = localStorage.getItem("VisitorID");

    if (!VisitorID) {
      setError("You must be logged in.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First save payment information
      const paymentResponse = await fetch(`${BACKEND_URL}/payment-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, VisitorID })
      });

      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Payment information could not be saved");
      }
      
      // Process merchandise purchases if cart exists
      if (merchandiseCart && merchandiseCart.length > 0) {
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Process each item in the cart
        for (const item of merchandiseCart) {
          const transactionData = {
            merchandiseID: item.merchandiseID,
            VisitorID: VisitorID,
            transactionDate: currentDate,
            quantity: item.quantity,
            totalAmount: (item.price * item.quantity).toFixed(2)
          };
          
          const merchResponse = await fetch(`${BACKEND_URL}/add-merchandise-transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData)
          });
          
          const merchData = await merchResponse.json();
          if (!merchResponse.ok) {
            throw new Error(merchData.error || `Failed to purchase ${item.itemName}`);
          }
        }
        
        // Clear the cart after successful purchase
        localStorage.removeItem('merchandiseCart');
      }

      // Show success popup
      setShowSuccessPopup(true);
      
      // Automatically redirect after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/portal");
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <div className="max-w-xl mx-auto">
          {/* Success Popup */}
          {showSuccessPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
              <div className="bg-gradient-to-b from-gray-900 to-black border border-purple-500 rounded-xl p-8 max-w-md mx-auto shadow-lg shadow-purple-500/30 animate-fadeIn">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-purple-300 mb-2">Purchase Complete!</h2>
                  <p className="text-gray-300 mb-6">Your order has been successfully processed.</p>
                  <button 
                    onClick={() => {
                      setShowSuccessPopup(false);
                      navigate("/portal");
                    }}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
                  >
                    View Your Account
                  </button>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h1>
          
          {/* Order Summary Section */}
          {merchandiseCart && merchandiseCart.length > 0 && (
            <div className="bg-white/10 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-purple-300">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {merchandiseCart.map((item) => (
                  <div key={item.merchandiseID} className="flex justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{item.itemName}</span>
                      <span className="text-sm text-gray-400 ml-2">x{item.quantity}</span>
                    </div>
                    <div className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span>Total:</span>
                <span>${orderSummary.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          
          {/* Payment Form */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Payment Information</h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="CardholderName" className="block text-sm mb-1">Cardholder Name</label>
                <input 
                  id="CardholderName"
                  name="CardholderName" 
                  placeholder="John Doe" 
                  value={form.CardholderName} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none" 
                />
              </div>
              
              <div>
                <label htmlFor="CardType" className="block text-sm mb-1">Card Type</label>
                <select
                  id="CardType"
                  name="CardType"
                  value={form.CardType}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select Card Type</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="CardNumber" className="block text-sm mb-1">Card Number</label>
                  <input 
                    id="CardNumber"
                    name="CardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    value={form.CardNumber} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="ExpiryDate" className="block text-sm mb-1">Expiry</label>
                    <input 
                      id="ExpiryDate"
                      name="ExpiryDate" 
                      placeholder="MM/YY" 
                      value={form.ExpiryDate} 
                      onChange={handleChange} 
                      required 
                      className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label htmlFor="CVV" className="block text-sm mb-1">CVV</label>
                    <input 
                      id="CVV"
                      name="CVV" 
                      placeholder="123" 
                      value={form.CVV} 
                      onChange={handleChange} 
                      required 
                      className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="BillingAddress" className="block text-sm mb-1">Billing Address</label>
                <textarea 
                  id="BillingAddress"
                  name="BillingAddress" 
                  placeholder="123 Space Lane, Galaxy City" 
                  value={form.BillingAddress} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none" 
                  rows="3"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-3 rounded-lg font-bold transition-all disabled:opacity-70 mt-4"
              >
                {isSubmitting ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}