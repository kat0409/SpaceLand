// src/pages/Home.jsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import SidebarMenu from "../components/SidebarMenu";
import EventsPreview from "../components/EventsPreview";
import DiningSection from "../components/DiningSection";
import PricingSection from "../components/PricingSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="relative bg-black text-white">
      <Header />
      <SidebarMenu />
      <Hero />
      <EventsPreview />
      <DiningSection />
      <PricingSection />
      <Footer />
    </main>
  );
}