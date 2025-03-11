// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dining from "./pages/Dining";
import Events from "./pages/Events";
import Pricing from "./pages/Pricing";
import Rides from "./pages/Rides";
import EmployeeLogin from "./pages/EmployeeLogin";
import UserPortal from "./pages/UserPortal";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/events" element={<Events />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/portal" element={<UserPortal />} />
      </Routes>
    </Router>
  );
}