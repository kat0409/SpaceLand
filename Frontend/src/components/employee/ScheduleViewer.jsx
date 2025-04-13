import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScheduleViewer({ employeeID }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek());

  function getStartOfWeek(date = new Date()) {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = newDate.getDate() - day;
    return new Date(newDate.setDate(diff));
  }

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';
        const response = await fetch(
          `${BACKEND_URL}/employee/schedule?EmployeeID=${employeeID}&startDate=${selectedWeek.toISOString()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }

        const data = await response.json();
        setSchedule(data);
        setError(null);
      } catch (err) {
        setError('Failed to load schedule. Please try again later.');
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [employeeID, selectedWeek]);

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeek(getStartOfWeek(newDate));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Schedule</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigateWeek(-1)}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Previous Week
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Next Week
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-red-400 text-center py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => {
            const date = new Date(selectedWeek);
            date.setDate(date.getDate() + index);
            const shift = schedule.find(s => new Date(s.date).toDateString() === date.toDateString());

            return (
              <div
                key={day}
                className={`p-4 rounded-lg ${
                  date.toDateString() === new Date().toDateString()
                    ? 'bg-purple-900/30 border border-purple-500/50'
                    : 'bg-black/20'
                }`}
              >
                <p className="font-medium mb-2">{day}</p>
                <p className="text-sm text-gray-400">
                  {date.toLocaleDateString()}
                </p>
                {shift ? (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-purple-400">
                      {shift.startTime} - {shift.endTime}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {shift.location || 'Location TBD'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No shift scheduled</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
} 