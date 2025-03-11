// src/components/RidesPreview.jsx
import { motion } from 'framer-motion';

export default function RidesPreview() {
  const rides = [
    {
      title: 'Galaxy Coaster',
      description: 'A high-speed journey through the stars.',
      image: '/assets/galaxy-coaster.jpg',
    },
    {
      title: 'Black Hole Drop',
      description: 'Plunge into the unknown at warp speed.',
      image: '/assets/black-hole-drop.jpg',
    },
    {
      title: 'Lunar Loop',
      description: 'Defy gravity on this cosmic looping adventure.',
      image: '/assets/lunar-loop.jpg',
    },
  ];

  return (
    <section id="rides"className="bg-gradient-to-b from-black via-gray-900 to-black py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          🚀 Our Thrilling <span className="text-purple-400">Space Rides</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {rides.map((ride, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              <img
                src={ride.image}
                alt={ride.title}
                className="w-full h-56 object-cover rounded-xl mb-4 border border-white/10"
              />
              <h3 className="text-2xl font-semibold text-white mb-2">{ride.title}</h3>
              <p className="text-gray-300 text-sm">{ride.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}