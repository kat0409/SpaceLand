import Header from '../components/Header';
import Hero from '../components/Hero';
import RidesPreview from '../components/RidesPreview';
import DiningSection from '../components/DiningSection';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';
import SidebarMenu from '../components/SidebarMenu';
import { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function Home() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/alerts`)
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Failed to fetch alerts", err));
  }, []);

  return (
    <>
      <Header />
      <SidebarMenu />
      {/*Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white text-center py-4 shadow-lg z-50 relative">
          {alerts.map(alert => (
            <p key={alert.alertID}>
              {alert.alertMessage}{" "}
              <span className="text-sm text-white/70 ml-2">
                ({new Date(alert.timestamp).toLocaleString()})
              </span>
            </p>
          ))}
        </div>
      )}
      <Hero />
      <RidesPreview />
      <DiningSection />
      <PricingSection />
      <Footer />
    </>
  );
}