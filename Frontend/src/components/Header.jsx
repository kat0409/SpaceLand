// src/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from "lucide-react"; // ✅ Lucide User Icon

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rides', href: '/rides' },
    { name: 'Events', href: '/events' },
    { name: 'Dining', href: '/dining' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '#footer' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* 🚀 Logo */}
        <Link to="/" className="relative flex items-center">
          <div className="h-8 md:h-10 w-auto scale-[6.0] transform origin-left -ml-20">
            <img
              src="/assets/SpaceLand.svg"
              alt="Spaceland Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* 💻 Desktop Navigation */}
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

          {/* 🛒 Cart Button */}
          <Link
  to="/purchase"
  className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-md hover:scale-105"
>
  <svg className="w-5 h-5" viewBox="0 0 576 512" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
  </svg>
</Link>

          {/* 👤 User Icon Button */}
          <Link
            to="/auth"
            className="flex items-center justify-center w-[38px] h-[38px] bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-full hover:from-purple-700 hover:to-indigo-600 shadow-md transition"
          >
            <User size={18} />
          </Link>
        </nav>

        {/* 📱 Mobile Hamburger Button */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Navigation Dropdown */}
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

          {/* 👤 Mobile Login Button */}
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