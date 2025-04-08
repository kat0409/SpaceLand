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
  const {logout} = useContext(AuthContext);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

  useEffect(() => {
    const visitorID = localStorage.getItem('visitorID');
    if(!visitorID){
      return;
    } 
    console.log(visitorID);
    fetch(`${BACKEND_URL}/account-info?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => setUserData(data[0]))
      .catch(err => console.error("Error fetching account info:", err));
    fetch(`${BACKEND_URL}/purchase-history?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => setPurchases(data));
      //.catch(err => console.error("Error fetching purchase history:", err));
    fetch(`${BACKEND_URL}/ticket-history?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => setTickets(data[0]))
      .catch(err => console.error("Error fetching ticket history:", err))
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <h2 className="text-4xl font-bold mb-6">🌌 Welcome to Your Portal</h2>
        <p className="text-gray-400 mb-10">View your passes, perks, and cosmic stats here.</p>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl max-w-xl mx-auto">
          {/* Account Info */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
            <h2 className="text-3xl font-bold mb-2">Account Info</h2>
            {userData ? (
              <p className="text-gray-300">
                <strong>First Name:</strong> {userData.FirstName} <br />
                <strong>Last Name:</strong> {userData.LastName} <br />
                <strong>Phone:</strong> {userData.Phone} <br />
                <strong>Email:</strong> {userData.Email} <br />
                <strong>Address:</strong> {userData.Address} <br />
                <strong>Date of Birth:</strong> {userData.DateOfBirth} <br />
                <strong>Gender:</strong> {userData.Gender} <br />
                <strong>Height:</strong> {userData.Height} <br />
                <strong>Age:</strong> {userData.Age} <br />
                <strong>Military Status:</strong> {userData.MilitaryStatus ? 'Yes' : 'No'} <br />
                <strong>Accessibility Needs:</strong> {userData.AccessibilityNeeds ? 'Yes' : 'No'}
              </p>
            ) : (
              <p className="text-gray-400">Loading account info...</p>
            )}
          </div>
          {/* Ticket History */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
            <h2 className="text-3xl font-bold mb-2">Ticket History</h2>
            {tickets ? (
              <p className="text-gray-300">
                <strong>Transaction Date:</strong> {tickets.transactionDate} <br />
                <strong>Ticket Type:</strong> {tickets.ticketType} <br />
                <strong>Quantity:</strong> {tickets.quantity} <br />
                <strong>Total Amount:</strong> {tickets.totalAmount} <br />
              </p>
            ) : (
              <p className="text-gray-400">Loading ticket history...</p>
            )}
          </div>
          {/*Purchases*/}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-semibold mb-4">📦 Merchandise Transactions</h3>
            {purchases.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="text-purple-300">
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Shop</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((tx, idx) => (
                    <tr key={idx} className="border-t border-white/10">
                      <td>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                      <td>{tx.itemName}</td>
                      <td>{tx.giftShopName}</td>
                      <td>{tx.quantity}</td>
                      <td>${parseFloat(tx.price).toFixed(2)}</td>
                      <td>${parseFloat(tx.totalAmount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No merchandise transactions found.</p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            window.location.href = "/auth"
          }}
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
        >
          Logout
        </button>
      </section>
      <Footer />
    </>
  );
}