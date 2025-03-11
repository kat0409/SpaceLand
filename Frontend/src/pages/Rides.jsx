// src/pages/Rides.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function Rides() {
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
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">🎢 Spaceland Rides</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            Explore our universe of exhilarating rides designed for thrill-seekers, families, and everyone in between.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {rides.map((ride, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl transition"
              >
                <img
                  src={ride.image}
                  alt={ride.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 text-left">
                  <h3 className="text-2xl font-semibold mb-1">{ride.title}</h3>
                  <p className="text-sm text-purple-300 mb-2">{ride.type}</p>
                  <p className="text-gray-300 text-sm">{ride.description}</p>
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