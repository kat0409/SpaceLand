// src/App.jsx
import Header from './components/Header';
import Hero from './components/Hero';
import RidesPreview from './components/RidesPreview';
import EventsPreview from './components/EventsPreview';
import Footer from './components/Footer';
import PricingSection from './components/PricingSection';
import DiningSection from './components/DiningSection';

export default function App() {
  return (
    <div>
      <Header />
      <Hero />
      <RidesPreview />
      <EventsPreview />
      <DiningSection />
      <PricingSection />
      <Footer />
    </div>
  );
}