// src/pages/Dining.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function Dining() {
  const restaurants = [
    {
      name: 'Galactic Grub Hub',
      tier: 'General',
      image: '/assets/galactic-grub.jpg', // Make sure this image exists in /public/assets
      description:
        'Enjoy classic park favorites with a cosmic twist — burgers, fries, and nebula milkshakes!',
    },
    {
      name: 'Cosmo Café',
      tier: 'Cosmic',
      image: '/assets/cosmo-cafe.jpg',
      description:
        'Elegant space dining under the stars with a chef-curated experience and cosmic cuisine.',
    },
    {
      name: 'Rocket Fuel Express',
      tier: 'General',
      image: '/assets/rocket-fuel.jpg',
      description:
        'Quick bites for adventurers on the go — interstellar tacos, wraps, and comet smoothies!',
    },
  ];

  const tierColors = {
    General: 'bg-blue-500 text-white',
    Cosmic: 'bg-yellow-400 text-black',
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24 px-6 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">
            🍽 Dining at <span className="text-purple-400">Spaceland</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Fuel your intergalactic journey with a variety of cosmic cuisine experiences.
          </p>

          {/* Featured Cosmo Café Section */}
          <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-gray-700">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-80 md:h-auto overflow-hidden">
                <img 
                  src="/assets/cafe.jpg" 
                  alt="Cosmo Café Featured Image" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent md:bg-gradient-to-l md:from-transparent md:to-black/80"></div>
              </div>
              <div className="p-8 flex flex-col justify-center text-left">
                <h3 className="text-3xl font-bold text-purple-300 mb-4">Featured: Cosmo Café</h3>
                <p className="text-gray-200 mb-6">
                  Experience the pinnacle of cosmic cuisine at our signature restaurant. Cosmo Café offers a sophisticated dining atmosphere with panoramic views of the celestial surroundings. Our award-winning chefs create dishes that blend Earth's finest ingredients with innovative space-inspired techniques.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-5 h-5 flex items-center justify-center bg-purple-500 rounded-full mr-2">✓</span>
                    <span>Elegant space-themed ambiance</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5 h-5 flex items-center justify-center bg-purple-500 rounded-full mr-2">✓</span>
                    <span>Cosmic Meal Plan accepted</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5 h-5 flex items-center justify-center bg-purple-500 rounded-full mr-2">✓</span>
                    <span>Reservations recommended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.map((res, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 border border-gray-700 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl text-left"
              >
                <img
                  src={res.image}
                  alt={res.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{res.name}</h3>
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded-full mb-3 ${
                      tierColors[res.tier]
                    }`}
                  >
                    {res.tier} Meal Plan
                  </span>
                  <p className="text-sm text-gray-300">{res.description}</p>
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