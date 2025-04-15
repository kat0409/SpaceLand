import React, { useState } from 'react';

const EmployeeCalendarView = ({ schedule }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  });

  // Format date to YYYY-MM-DD
  const formatLocalDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Navigate weeks
  const navigateWeek = (direction) => {
    setCurrentWeekStart(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + (direction * 7));
      return newDate;
    });
  };

  // Create a map of schedules by date
  const scheduleMap = {};
  schedule.forEach(s => {
    if (!scheduleMap[s.scheduleDate]) {
      scheduleMap[s.scheduleDate] = [];
    }
    scheduleMap[s.scheduleDate].push(s);
  });

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Format the month and date
  const formatMonthDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    const dayStr = formatLocalDate(date);
    const shifts = scheduleMap[dayStr] || [];
    const isPast = isPastDate(date);

    return (
      <div key={i} className={`bg-black/30 p-4 rounded-lg text-white border ${isPast ? 'border-gray-800' : 'border-white/10'}`}>
        <p className="font-semibold mb-1">{daysOfWeek[i]}</p>
        <p className="text-sm text-gray-300 mb-2">{formatMonthDate(date)}</p>
        {shifts.length > 0 ? (
          shifts.map((shift, idx) => (
            <div 
              key={idx} 
              className={`text-sm mb-1 rounded px-2 py-1 ${
                isPast 
                  ? 'bg-gray-800/50 text-gray-400' 
                  : 'bg-purple-900/50 text-purple-300'
              }`}
            >
              {shift.shiftStart} - {shift.shiftEnd}
            </div>
          ))
        ) : (
          <p className={`text-xs italic ${isPast ? 'text-gray-700' : 'text-gray-500'}`}>
            No shift scheduled
          </p>
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
          <h3 className="text-lg font-semibold">
            {formatMonthDate(currentWeekStart)} - {formatMonthDate(weekEndDate)}
          </h3>
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

export default EmployeeCalendarView;
