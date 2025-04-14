import React from 'react';

const CalendarView = ({ schedule, startDate = new Date() }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Start from the beginning of the week
  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  // Convert schedule list into a lookup by date string
  const scheduleMap = {};
  schedule.forEach(s => {
    const dateStr = new Date(s.scheduleDate).toDateString();
    if (!scheduleMap[dateStr]) scheduleMap[dateStr] = [];
    scheduleMap[dateStr].push(s);
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toDateString();
    const shifts = scheduleMap[dateStr] || [];

    return (
      <div key={i} className="bg-black/30 p-4 rounded-lg text-white border border-white/10">
        <p className="font-semibold mb-1">{daysOfWeek[i]}</p>
        <p className="text-sm text-gray-300 mb-2">{date.toLocaleDateString()}</p>
        {shifts.length > 0 ? (
          shifts.map((shift, idx) => (
            <div key={idx} className="text-sm text-purple-300 mb-1">
              {shift.shiftStart} - {shift.shiftEnd}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 italic">No shift scheduled</p>
        )}
      </div>
    );
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
      {days}
    </div>
  );
};

export default CalendarView;
