// src/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },            // Page Route
    { name: 'Rides', href: '/rides' },      // Page Route
    { name: 'Events', href: '/events' },    // Page Route
    { name: 'Dining', href: '/dining' },    // Scroll Anchor
    { name: 'Pricing', href: '/pricing' },  // Scroll Anchor
    { name: 'Contact', href: '#footer' },   // Scroll Anchor
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-2xl font-bold tracking-tight hover:text-purple-400 transition"
        >
          Spaceland 🚀
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-purple-400 font-medium transition"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-white hover:text-purple-400 font-medium transition"
              >
                {link.name}
              </Link>
            )
          )}

          {/* LOGIN BUTTON */}
          <Link
            to="/auth"
            className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-indigo-600 transition-all"
          >
            Login
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {isOpen && (
        <div className="md:hidden bg-black/90 px-6 pb-4">
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white py-2 hover:text-purple-400 transition"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white py-2 hover:text-purple-400 transition"
              >
                {link.name}
              </Link>
            )
          )}

          {/* Mobile Login Button */}
          <Link
            to="/auth"
            className="block text-center mt-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-indigo-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}