// src/components/ui/SidebarMenu.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Ticket, Calendar, Utensils, DollarSign, Phone, LogIn } from "lucide-react";

export default function SidebarMenu({ isOpen, onClose }) {
  const menuItems = [
    { label: "Home", icon: <Home className="w-5 h-5" />, href: "#home" },
    { label: "Rides", icon: <Ticket className="w-5 h-5" />, href: "#rides" },
    { label: "Events", icon: <Calendar className="w-5 h-5" />, href: "#events" },
    { label: "Dining", icon: <Utensils className="w-5 h-5" />, href: "#dining" },
    { label: "Pricing", icon: <DollarSign className="w-5 h-5" />, href: "#pricing" },
    { label: "Contact", icon: <Phone className="w-5 h-5" />, href: "#contact" },
    { label: "Login", icon: <LogIn className="w-5 h-5" />, href: "/login" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sliding Sidebar */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-72 bg-black/90 backdrop-blur-md z-50 shadow-lg border-r border-white/10 rounded-r-3xl"
          >
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
              <img src="/assets/SpaceLand.svg" alt="Spaceland Logo" className="h-7" />
              <button
                onClick={onClose}
                className="text-white hover:text-purple-400 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items with Staggered Entry */}
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="px-6 py-6"
            >
              {menuItems.map((item) => (
                <motion.li
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center space-x-4 mb-5 text-white hover:text-purple-400 transition duration-300"
                >
                  {item.icon}
                  <a href={item.href} className="text-lg font-semibold">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}