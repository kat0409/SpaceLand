// src/App.jsx
import Header from './components/Header';
import Hero from './components/Hero';
import RidesPreview from './components/RidesPreview';
import EventsPreview from './components/EventsPreview';
import Footer from './components/Footer';

export default function App() {
  return (
    <div>
      <Header />
      <Hero />
      <RidesPreview />
      <EventsPreview />
      <Footer />
    </div>
  );
}