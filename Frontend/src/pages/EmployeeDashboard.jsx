// src/pages/EmployeeDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import EmployeeProfile from '../components/employee/EmployeeProfile';
import ScheduleViewer from '../components/employee/ScheduleViewer';
import TimeOffRequest from '../components/employee/TimeOffRequest';
import EmployeeCalendarView from '../components/EmployeeCalendarView';
import ClockInOutForm from '../components/ClockInOutForm';

export default function EmployeeDashboard() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [schedule, setSchedule] = useState([]);

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

  const handleLogout = () => {
    logout();
    navigate("/employee-login");
  };

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== "employee") {
      navigate("/employee-login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/employee/profile?EmployeeID=${auth.userID}`);
        if (!res.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await res.json();

        if (data && data.EmployeeID) {
          setEmployee(data);
          setError('');
        } else {
          setError('Unable to fetch employee info.');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Error fetching employee data.');
      }
    };

    const fetchScheduleData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/employee/get-schedule?employeeID=${auth.userID}`);
        if (!res.ok) {
          throw new Error('Failed to fetch schedule data');
        }
        const data = await res.json();
        
        // Format the schedule data
        const formattedSchedule = data.map(shift => ({
          ...shift,
          scheduleDate: new Date(shift.scheduleDate).toISOString().split('T')[0],
          shiftStart: shift.shiftStart.substring(0, 5),  // Convert "00:00:00" to "00:00"
          shiftEnd: shift.shiftEnd.substring(0, 5)      // Convert "00:00:00" to "00:00"
        }));
        
        setSchedule(formattedSchedule);
      } catch (err) {
        console.error('Schedule Fetch Error:', err);
        setError('Error fetching schedule data.');
      }
    };

    if (auth.userID) {
      fetchEmployeeData();
      fetchScheduleData();
    }
  }, [auth.userID]);

  const handleProfileUpdate = (updatedData) => {
    setEmployee(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'schedule', label: '📅 Schedule' },
    { id: 'timeoff', label: '🏖 Time Off' }
  ];

  return (
    <>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl font-bold mb-4 md:mb-0">
              Welcome, {employee?.FirstName || 'Employee'}! 👋
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {activeTab === 'profile' && employee && (
              <EmployeeProfile
                employee={employee}
                onUpdate={handleProfileUpdate}
              />
            )}

            {activeTab === 'schedule' && auth.userID && (
              <>
                <EmployeeCalendarView schedule={schedule} />
                <ScheduleViewer employeeID={auth.userID} />
                <ClockInOutForm employeeID={auth.userID} />
              </>            
            )}

            {activeTab === 'timeoff' && auth.userID && (
              <TimeOffRequest employeeID={auth.userID} />
            )}
          </div>
        </div>
      </motion.main>
      <Footer />
    </>
  );
}