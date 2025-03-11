// src/components/DiningSection.jsx
import { motion } from 'framer-motion';

export default function DiningSection() {
  const restaurants = [
    {
      name: 'Galactic Grub Hub',
      tier: 'Standard',
      image: '/public/assets/galactic-grub.jpg', // <-- You’ll add this image
      description:
        'Enjoy classic park favorites with a cosmic twist — burgers, fries, and nebula milkshakes!',
    },
    {
      name: 'Cosmo Café',
      tier: 'Premium',
      image: '/public/assets/cosmo-cafe.jpg', // <-- You’ll add this image
      description:
        'Elegant space dining under the stars with a chef-curated experience and cosmic cuisine.',
    },
    {
      name: 'Rocket Fuel Express',
      tier: 'Standard',
      image: '/public/assets/rocket-fuel.jpg', // <-- You’ll add this image
      description:
        'Quick bites for adventurers on the go — interstellar tacos, wraps, and comet smoothies!',
    },
  ];

  const tierColors = {
    Standard: 'bg-blue-500 text-white',
    Premium: 'bg-yellow-400 text-black',
  };

  return (
    <section id="dining" className="bg-gradient-to-b from-black via-gray-900 to-black py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          🍽 Dining at <span className="text-purple-400">Spaceland</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {restaurants.map((res, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 border border-gray-700 backdrop-blur-lg text-white rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={res.image}
                alt={res.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-6 text-left">
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
  );
}