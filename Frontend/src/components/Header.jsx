// src/components/Header.jsx
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart } from "lucide-react";
import { AuthContext } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Effect to check cart contents when component mounts or when storage changes
  useEffect(() => {
    const updateCartCount = () => {
      const merchandiseCart = localStorage.getItem('merchandiseCart');
      if (merchandiseCart) {
        try {
          const cart = JSON.parse(merchandiseCart);
          const count = cart.reduce((total, item) => total + item.quantity, 0);
          setCartItemCount(count);
        } catch (err) {
          console.error("Error parsing cart data:", err);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    // Initialize cart count
    updateCartCount();

    // Listen for storage changes (if cart is updated in another tab)
    window.addEventListener('storage', updateCartCount);

    // Clean up
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rides', href: '/rides' },
    { name: 'Events', href: '/events' },
    { name: 'Dining', href: '/dining' },
    { name: 'Shopping', href: '/shopping' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '#footer' },
  ];

  const handleProfileClick = () => {
    if(auth.role === 'employee'){//employees
      navigate('/employee-dashboard');
    }
    else if(auth.role === 'supervisor'){//supervisors
      const dept = localStorage.getItem('department')?.toLowerCase();
      if(dept === 'maintenance') navigate('/supervisor/maintenance');
      else if(dept === 'merchandise') navigate('/supervisor/merchandise');
      else if (dept === 'management') navigate('/supervisor/HR');
    }
    else{//visitors
      navigate('/portal')
    }
  };

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
            to="/shopping"
            className="relative p-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-md hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* 👤 User Icon Button */}
          {auth.isAuthenticated ? (
            <button
              onClick={() => {
                if (auth.role === "employee") {
                  navigate("/employee-dashboard");
                } else if (auth.role === "supervisor") {
                  const dept = localStorage.getItem("department")?.toLowerCase();
                  if (dept === "merchandise") navigate("/supervisor/merchandise");
                  else if (dept === "maintenance") navigate("/supervisor/maintenance");
                  else if (dept === "management") navigate("/supervisor/HR");
                  else navigate("/supervisor-portal");
                } else if (auth.role === "visitor") {
                  navigate("/portal");
                }
              }}
              className="flex items-center justify-center w-[38px] h-[38px] bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              <User size={18} />
            </button>
          ) : (
            <Link
              to="/auth"
              className="flex items-center justify-center w-[38px] h-[38px] bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-full hover:from-purple-700 hover:to-indigo-600 shadow-md transition"
            >
              <User size={18} />
            </Link>
          )}
      </nav>
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