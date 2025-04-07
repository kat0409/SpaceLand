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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

  useEffect(() => {
    const visitorID = localStorage.getItem('visitorID');
    if(!visitorID){
      return;
    } 

    fetch(`${BACKEND_URL}/purchase-history?visitorID=${visitorID}`)
      .then(res => res.json())
      .then(data => setPurchases(data));
      //.catch(err => console.error("Error fetching purchase history:", err));
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <h2 className="text-4xl font-bold mb-6">🌌 Welcome to Your Portal</h2>
        <p className="text-gray-400 mb-10">View your passes, perks, and cosmic stats here.</p>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl max-w-xl mx-auto">
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
      </section>
      <Footer />
    </>
  );
}