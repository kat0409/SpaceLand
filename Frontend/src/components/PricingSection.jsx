// src/components/PricingSection.jsx
import { motion } from 'framer-motion';

export default function PricingSection() {
  const passes = [
    {
      title: 'General Pass',
      price: '$49',
      perks: [
        'Full-day park access',
        'Unlimited ride entries',
        'Standard queue access',
        '1 free drink voucher',
      ],
      bg: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Cosmic Pass',
      price: '$89',
      perks: [
        'All General Pass features',
        'Priority queue access',
        'Free meal & souvenir',
        'VIP Lounge access',
        'Exclusive night show access',
      ],
      bg: 'from-purple-600 to-pink-500',
    },
  ];

  return (
    <section id="pricing" className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          🎟 Spaceland <span className="text-pink-400">Passes</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {passes.map((pass, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${pass.bg} text-white p-8 rounded-2xl shadow-lg transition-all`}
            >
              <h3 className="text-2xl font-bold mb-2">{pass.title}</h3>
              <p className="text-3xl font-semibold mb-4">{pass.price}</p>
              <ul className="text-sm text-white/90 space-y-2 mb-6">
                {pass.perks.map((perk, i) => (
                  <li key={i}>✓ {perk}</li>
                ))}
              </ul>
              <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
                Select Pass
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}