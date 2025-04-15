import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Rides from "./pages/Rides";
import Events from "./pages/Events";
import Auth from "./pages/Auth";
import UserPortal from "./pages/UserPortal";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Dining from "./pages/Dining";
import Pricing from "./pages/Pricing";
import CursorOverlay from "./components/ui/CursorOverlay";
import SupervisorPortal from "./pages/SupervisorPortal";
import Purchase from "./pages/Purchase";
import MerchandiseSupervisorPortal from './pages/MerchandiseSupervisorPortal';
import MaintenanceSupervisorPortal from './pages/MaintenanceSupervisorPortal';
import HRSupervisorPortal from './pages/HRSupervisorPortal';
import Shopping from './pages/Shopping';
import PaymentForm from './pages/PaymentForm';

export default function App() {
  return (
    
    <Router>
      <CursorOverlay />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Routes>
          <Route path="/supervisor-portal" element={<SupervisorPortal />} />
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/employee-login" element={<EmployeeLogin />} /> {/* Employee Login */}
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/events" element={<Events />} />
          <Route path="/auth" element={<Auth />} /> {/* Visitor Login (Keep this) */}
          <Route path="/portal" element={<UserPortal />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/userportal" element={<UserPortal />} />
          <Route path="/payment-form" element={<PaymentForm />} />
          <Route path="/supervisor/merchandise" element={<MerchandiseSupervisorPortal />} />
          <Route path="/supervisor/maintenance" element={<MaintenanceSupervisorPortal />} />
          <Route path="/supervisor/HR" element={<HRSupervisorPortal />} />
        </Routes>
      </motion.div>
    </Router>
  );
}