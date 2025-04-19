import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

const CalendarView = ({ schedule, startDate = new Date() }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [employeeNames, setEmployeeNames] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  });
  
  // Navigate weeks
  const navigateWeek = (direction) => {
    setCurrentWeekStart(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + (direction * 7));
      return newDate;
    });
  };
  
  // Fetch employee names on component mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/supervisor/HR/all-employee-names`)
      .then(res => res.json())
      .then(data => {
        // Create a lookup by employee ID
        const lookup = {};
        data.forEach(emp => {
          lookup[emp.EmployeeID] = `${emp.FirstName} ${emp.LastName}`;
        });
        setEmployeeNames(lookup);
      })
      .catch(err => console.error("Failed to fetch employee names", err));
  }, []);

  // Convert schedule list into a lookup by date string
  const scheduleMap = {};
  schedule.forEach(s => {
    const dateStr = new Date(s.scheduleDate).toDateString();
    if (!scheduleMap[dateStr]) scheduleMap[dateStr] = [];
    scheduleMap[dateStr].push(s);
  });

  // Format time for display (HH:MM:SS -> HH:MM)
  const formatTime = (timeStr) => {
    return timeStr ? timeStr.substring(0, 5) : '';
  };
  
  // Format the month and date
  const formatMonthDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toDateString();
    const shifts = scheduleMap[dateStr] || [];

    return (
      <div key={i} className="bg-black/30 p-4 rounded-lg text-white border border-white/10">
        <p className="font-semibold mb-1">{daysOfWeek[i]}</p>
        <p className="text-sm text-gray-300 mb-2">{date.toLocaleDateString()}</p>
        {shifts.length > 0 ? (
          shifts.map((shift, idx) => (
            <div key={idx} className="text-sm bg-purple-900/40 p-2 rounded mb-2">
              <div className="text-purple-300">
                {formatTime(shift.shiftStart)} - {formatTime(shift.shiftEnd)}
              </div>
              <div className="text-yellow-300 text-xs font-medium">
                {employeeNames[shift.EmployeeID] || `Employee #${shift.EmployeeID}`}
              </div>
              <div className="text-gray-400 text-xs">
                {shift.Department}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 italic">No shift scheduled</p>
        )}
      </div>
    );
  });
  
  // Calculate the date range for the current week
  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateWeek(-1)}
          className="px-4 py-2 bg-purple-600/50 rounded-lg hover:bg-purple-600 transition-colors"
        >
          ← Previous Week
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">
            {formatMonthDate(currentWeekStart)} - {formatMonthDate(weekEndDate)}
          </h2>
        </div>
        <button 
          onClick={() => navigateWeek(1)}
          className="px-4 py-2 bg-purple-600/50 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Next Week →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {days}
      </div>
    </div>
  );
};

export default CalendarView;