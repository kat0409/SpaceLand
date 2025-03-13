import Header from '../components/Header';
import Hero from '../components/Hero';
import RidesPreview from '../components/RidesPreview';
import EventsPreview from '../components/EventsPreview';
import DiningSection from '../components/DiningSection';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';
import SidebarMenu from '../components/SidebarMenu';

export default function Home() {
  return (
    <>
      <Header />
      <SidebarMenu />
      <Hero />
      <RidesPreview />
      <EventsPreview />
      <DiningSection />
      <PricingSection />
      <Footer />
    </>
  );
}