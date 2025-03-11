// src/components/SidebarMenu.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Rides', href: '#rides' },
    { name: 'Events', href: '#events' },
    { name: 'Dining', href: '#dining' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#footer' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-6 left-6 z-50 text-white bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition"
      >
        ☰
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-lg z-40 p-6 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Spaceland 🚀</h3>
            <nav className="space-y-4">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="block text-white hover:text-purple-400 transition text-lg"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Close Button */}
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-white text-xl hover:text-red-400"
            >
              ✕
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}