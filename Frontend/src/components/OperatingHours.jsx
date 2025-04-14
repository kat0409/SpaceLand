// src/components/OperatingHours.jsx
import { motion } from 'framer-motion';

export default function OperatingHours() {
  const operatingHours = [
    { day: 'Monday - Thursday', hours: '10:00 AM - 8:00 PM' },
    { day: 'Friday', hours: '10:00 AM - 10:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 11:00 PM' },
    { day: 'Sunday', hours: '9:00 AM - 9:00 PM' },
  ];

  const holidays = [
    { name: 'New Year\'s Day', hours: '10:00 AM - 6:00 PM' },
    { name: 'Independence Day', hours: '9:00 AM - 11:00 PM' },
    { name: 'Halloween', hours: '10:00 AM - Midnight' },
    { name: 'Thanksgiving', hours: 'Closed' },
    { name: 'Christmas Eve', hours: '10:00 AM - 6:00 PM' },
    { name: 'Christmas Day', hours: 'Closed' },
  ];

  return (
    <section id="hours" className="bg-gradient-to-b from-black via-gray-900 to-black py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          🕒 Operating <span className="text-purple-400">Hours</span>
        </motion.h2>
        
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Plan your cosmic adventure with our regular operating hours. Special hours may apply for holidays and special events.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Regular Hours */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl"
          >
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">Regular Hours</h3>
            <ul className="space-y-4">
              {operatingHours.map((schedule, index) => (
                <li key={index} className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-white font-medium">{schedule.day}</span>
                  <span className="text-gray-300">{schedule.hours}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Holiday Hours */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl"
          >
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">Holiday Hours</h3>
            <ul className="space-y-4">
              {holidays.map((holiday, index) => (
                <li key={index} className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-white font-medium">{holiday.name}</span>
                  <span className="text-gray-300">{holiday.hours}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="mt-10 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg inline-block">
          <p className="text-purple-300 text-sm">
            ⭐ For special events and seasonal operating hours, please check our <span className="font-semibold">Events</span> page.
          </p>
        </div>
      </div>
    </section>
  );
}