// src/pages/UserPortal.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import {useEffect, useState, useContext} from "react";
import { AuthContext } from '../components/AuthProvider';

export default function UserPortal() {
  const {auth} = useContext(AuthContext);
  const [userData, setUserData] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [events, setEvents] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const {logout} = useContext(AuthContext);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

  useEffect(() => {
    const visitorID = localStorage.getItem('VisitorID');
    if(!visitorID){
      setLoading(false);
      return;
    } 
    console.log("VisitorID from localStorage:", visitorID);
    
    // Fetch account info
    fetch(`${BACKEND_URL}/account-info?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => {
        console.log("Account info data:", data);
        setUserData(data[0]);
      })
      .catch(err => console.error("Error fetching account info:", err));
    
    // Fetch merchandise purchase history
    fetch(`${BACKEND_URL}/purchase-history?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => {
        console.log("Purchase history data:", data);
        setPurchases(data || []);
      })
      .catch(err => console.error("Error fetching purchase history:", err));
    
    // Fetch ticket purchase history
    fetch(`${BACKEND_URL}/ticket-history?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => {
        console.log("Ticket history data:", data);
        setTickets(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ticket history:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <h2 className="text-4xl font-bold mb-6">🌌 Welcome to Your Portal</h2>
        <p className="text-gray-400 mb-10">View your passes, perks, and cosmic stats here.</p>
        
        {loading ? (
          <div className="text-center">
            <p className="text-xl text-purple-400">Loading your cosmic data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Account Info */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4">👤 Account Info</h2>
              {userData ? (
                <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-300">
                        <span className="text-purple-300 font-semibold">First Name:</span> {userData.FirstName}<br />
                        <span className="text-purple-300 font-semibold">Last Name:</span> {userData.LastName}<br />
                        <span className="text-purple-300 font-semibold">Phone:</span> {userData.Phone}<br />
                        <span className="text-purple-300 font-semibold">Email:</span> {userData.Email}<br />
                        <span className="text-purple-300 font-semibold">Address:</span> {userData.Address}<br />
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300">
                        <span className="text-purple-300 font-semibold">Date of Birth:</span> {userData.DateOfBirth}<br />
                        <span className="text-purple-300 font-semibold">Gender:</span> {userData.Gender}<br />
                        <span className="text-purple-300 font-semibold">Height:</span> {userData.Height} cm<br />
                        <span className="text-purple-300 font-semibold">Age:</span> {userData.Age}<br />
                        <span className="text-purple-300 font-semibold">Military Status:</span> {userData.MilitaryStatus ? 'Yes' : 'No'}<br />
                        <span className="text-purple-300 font-semibold">Accessibility Needs:</span> {userData.AccessibilityNeeds ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No account information available. Please log in again.</p>
              )}
            </div>

            {/* Ticket History */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <h3 className="text-3xl font-bold mb-4">🎟️ Ticket History</h3>
              {tickets && tickets.length > 0 ? (
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-purple-300">
                      <tr>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Ticket Type</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket, idx) => (
                        <tr key={idx} className="border-t border-white/10">
                          <td className="p-2">{new Date(ticket.transactionDate).toLocaleDateString()}</td>
                          <td className="p-2">{ticket.ticketType}</td>
                          <td className="p-2">{ticket.quantity}</td>
                          <td className="p-2">${parseFloat(ticket.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-6 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-gray-400">No ticket purchases found.</p>
                  <a 
                    href="/purchase" 
                    className="inline-block mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                  >
                    Purchase Tickets
                  </a>
                </div>
              )}
            </div>

            {/* Merchandise Purchases */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
              <h3 className="text-3xl font-bold mb-4">🛍️ Merchandise Purchases</h3>
              {purchases && purchases.length > 0 ? (
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-purple-300">
                      <tr>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Item</th>
                        <th className="text-left p-2">Shop</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((tx, idx) => (
                        <tr key={idx} className="border-t border-white/10">
                          <td className="p-2">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                          <td className="p-2">{tx.itemName}</td>
                          <td className="p-2">{tx.giftShopName}</td>
                          <td className="p-2">{tx.quantity}</td>
                          <td className="p-2">${parseFloat(tx.price).toFixed(2)}</td>
                          <td className="p-2">${parseFloat(tx.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 p-6 bg-white/10 rounded-xl border border-white/10">No merchandise purchases found.</p>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              logout();
              window.location.href = "/auth";
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
          >
            Logout
          </button>
        </div>
      </section>
      <Footer />
    </>
  );
}