// src/pages/EmployeeLogin.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.username || !formData.password) {
      setError('Please fill in both fields.');
      return;
    }
  
    setLoading(true);
    setError('');

    //console.log("Sending request to:", `${BACKEND_URL}/employee-login`);
  
    try {
      const empRes = await fetch(`${BACKEND_URL}/employee-login`, {  // Calls `/employee/login`
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const empData = await empRes.json();
  
      if (empRes.ok && empData.employeeID) {
        localStorage.setItem('employeeID', empData.employeeID);
        localStorage.setItem('role', 'employee');
        navigate('/employee-dashboard');
        return;
      }

      const supRes = await fetch(`${BACKEND_URL}/supervisor/login`, {  // Calls `/supervisor/login`
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const supData = await supRes.json();
  
      if (supRes.ok && supData.supervisorID) {
        localStorage.setItem('supervisorID', supData.supervisorID);
        localStorage.setItem('role', 'supervisor');
        localStorage.setItem('department', supData.departmentName);
        
        const department = supData.departmentName?.toLowerCase()

        if(department === 'merchandise'){
          navigate('/supervisor/merchandise');
        }
        else if (department === 'maintenance'){
          navigate('/supervisor/maintenance');
        }
        else if (department === 'Management'){
          navigate('/supervisor/HR');
        }
        return;
      }
  
      setError(supData.error || empData.error || 'Invalid credentials.');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20 flex items-center justify-center"
      >
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-center">👩‍🚀 Employee Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm">Username</label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </motion.section>
      <Footer />
    </>
  );
}