// src/components/EventsPreview.jsx
import { motion } from 'framer-motion';

export default function EventsPreview() {
  const events = [
    {
      title: 'Starlight Festival',
      date: 'October 15, 2024',
      image: '/assets/starlight-festival.jpg',
    },
    {
      title: 'Space Race Marathon',
      date: 'November 5, 2024',
      image: '/assets/space-race.jpg',
    },
    {
      title: 'Alien Encounter Night',
      date: 'December 10, 2024',
      image: '/assets/alien-night.jpg',
    },
  ];

  return (
    <section id="events"className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          🌌 Upcoming <span className="text-indigo-400">Spaceland Events</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold text-white mb-1">{event.title}</h3>
                <p className="text-indigo-300 text-sm">{event.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}