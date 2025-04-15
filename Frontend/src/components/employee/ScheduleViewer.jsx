import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../AuthProvider';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function ScheduleViewer({employeeID}) {
  const { auth } = useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
      if (!employeeID) return;

      fetch(`${BACKEND_URL}/employee/get-schedule?employeeID=${employeeID}`)
          .then(res => res.json())
          .then(data => setSchedule(data))
          .catch(err => {
              console.error("Error fetching schedule:", err);
              setError("Failed to load schedule. Please try again later.");
          });
  }, [employeeID]);

  // Format date to YYYY-MM-DD
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Format time from HH:MM:SS to HH:MM
  const formatTime = (timeStr) => {
    return timeStr.substring(0, 5);
  };
  
  // Check if a date is in the past
  const isPastDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduleDate = new Date(dateStr);
    return scheduleDate < today;
  };
  
  // Format the full schedule entry to a readable format
  const formatScheduleEntry = (item) => {
    const date = formatDate(item.scheduleDate);
    const start = formatTime(item.shiftStart);
    const end = formatTime(item.shiftEnd);
    return `${date}: ${start} - ${end}`;
  };
  
  // Separate schedule into past and upcoming shifts
  const upcomingShifts = schedule.filter(item => !isPastDate(item.scheduleDate));
  const pastShifts = schedule.filter(item => isPastDate(item.scheduleDate));

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Work Schedule</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      {schedule.length > 0 ? (
        <>
          {upcomingShifts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 text-green-400">Upcoming Shifts</h3>
              <ul className="space-y-2">
                {upcomingShifts.map((item, idx) => (
                  <li key={idx} className="bg-black/30 p-3 rounded-lg border border-green-900/30">
                    {formatScheduleEntry(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {pastShifts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-400">Past Shifts</h3>
              <ul className="space-y-2">
                {pastShifts.map((item, idx) => (
                  <li key={idx} className="bg-black/30 p-3 rounded-lg opacity-70">
                    {formatScheduleEntry(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : !error && (
        <p className="text-gray-400">No shifts scheduled.</p>
      )}
    </div>
  );
} 