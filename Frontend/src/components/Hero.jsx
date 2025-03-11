// src/components/Hero.jsx
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home"className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/space-bg.jpg"
          alt="Galaxy Background"
          className="w-full h-full object-cover brightness-75"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg"
        >
          Welcome to <span className="text-purple-400">Spaceland</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl"
        >
          Houston’s ultimate space-themed rollercoaster adventure awaits.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          Explore Rides
        </motion.button>
      </div>
    </section>
  );
}