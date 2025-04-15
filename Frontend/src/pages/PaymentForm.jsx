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

      alert("Payment Info Saved!");
      navigate("/userportal");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 max-w-xl mx-auto">
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