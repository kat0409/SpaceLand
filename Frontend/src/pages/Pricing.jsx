// src/pages/Pricing.jsx
import Header from '../components/Header';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';
import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Pricing() {

  return (
    <>
      <Header />
      <PricingSection />
      <Footer />
    </>
  );
}