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

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
        <h2 className="text-4xl font-bold mb-6">🌌 Welcome to Your Portal</h2>
        <p className="text-gray-400 mb-10">View your passes, perks, and cosmic stats here.</p>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl max-w-xl mx-auto">
          <p className="text-white/90">🚀 Feature coming soon...</p>
        </div>
      </section>
      <Footer />
    </>
  );
}