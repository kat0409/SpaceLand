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

  return (
      <div>
          <h2>Work Schedule</h2>
          {error && <p className="text-red-500">{error}</p>}
          {schedule.length > 0 ? (
              <ul>
                  {schedule.map((item, idx) => (
                      <li key={idx}>
                          {item.scheduleDate}: {item.shiftStart} - {item.shiftEnd}
                      </li>
                  ))}
              </ul>
          ) : !error && <p>No shifts scheduled.</p>}
      </div>
  );
} 