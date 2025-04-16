import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

    try {
      const response = await fetch(`${BACKEND_URL}/payment-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, VisitorID })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Show custom popup instead of alert
      setShowSuccessPopup(true);
      
      // Automatically redirect after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/userportal");
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 max-w-xl mx-auto relative">
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
              <h2 className="text-2xl font-bold text-purple-300 mb-2">Payment Info Saved!</h2>
              <p className="text-gray-300 mb-6">Your payment information has been successfully stored.</p>
              <button 
                onClick={() => {
                  setShowSuccessPopup(false);
                  navigate("/userportal");
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Enter Payment Information</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="CardholderName" placeholder="Cardholder Name" value={form.CardholderName} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800" />
        <input name="CardType" placeholder="Card Type (e.g., Visa)" value={form.CardType} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800" />
        <input name="CardNumber" placeholder="Card Number" value={form.CardNumber} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800" />
        <input name="CVV" placeholder="CVV" value={form.CVV} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800" />
        <input name="ExpiryDate" placeholder="MM/YY" value={form.ExpiryDate} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800" />
        <textarea name="BillingAddress" placeholder="Billing Address" value={form.BillingAddress} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800" />
        <button type="submit" className="w-full bg-green-600 py-2 rounded hover:bg-green-700">Submit Payment</button>
      </form>
    </div>
  );
}