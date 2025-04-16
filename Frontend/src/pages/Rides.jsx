// src/pages/Rides.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import RideModelViewer from '../components/RideModelViewer';

export default function Rides() {
  const [selectedRide, setSelectedRide] = useState(0);
  
  const rides = [
    {
      title: 'Galaxy Coaster',
      type: 'Thrill Ride',
      image: '/assets/galaxy-coaster.jpg',
      description:
        'Zoom through wormholes and planetary loops at light-speed on this adrenaline-pumping rollercoaster.',
    },
    {
      title: 'Lunar Loop',
      type: 'Family Ride',
      image: '/assets/lunar-loop.jpg',
      description:
        'A smooth and fun lunar loop experience for all ages. Perfect for aspiring astronauts and their families.',
    },
    {
      title: 'Black Hole Drop',
      type: 'Extreme Drop',
      image: '/assets/black-hole-drop.jpg',
      description:
        'Brace for the plunge into the unknown — our most daring ride simulates the gravity pull of a black hole!',
    },
    {
      title: 'Astro Twister',
      type: 'Spinning Fun',
      image: '/assets/astro-twister.jpg',
      description:
        'Spin, tilt, and orbit with this intergalactic ride full of twists and turns across the cosmos.',
    },
  ];

  return (
    <>
      <Header />
      <section id="rides" className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-6 pt-32 pb-24 text-white">
        {/* Smooth fade transition from Hero video */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-transparent to-transparent z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-center">🎢 Spaceland Rides</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-center">
            Explore our universe of exhilarating rides designed for thrill-seekers, families, and everyone in between.
          </p>
          
          {/* 3D Model Viewer Section */}
          <div className="mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl p-6">
              <h3 className="text-2xl font-semibold mb-4 text-center">{rides[selectedRide].title} - Interactive 3D Experience</h3>
              <RideModelViewer rideType={rides[selectedRide].title} />
              <p className="text-gray-300 mt-4 text-center">{rides[selectedRide].description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rides.map((ride, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-white/5 backdrop-blur-sm border ${selectedRide === index ? 'border-purple-500' : 'border-white/10'} rounded-2xl overflow-hidden shadow-xl transition cursor-pointer`}
                onClick={() => setSelectedRide(index)}
              >
                <img
                  src={ride.image}
                  alt={ride.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-left">
                  <h3 className="text-xl font-semibold mb-1">{ride.title}</h3>
                  <p className="text-xs text-purple-300 mb-2">{ride.type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}