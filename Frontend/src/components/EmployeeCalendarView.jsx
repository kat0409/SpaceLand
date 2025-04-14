import React from 'react';

const EmployeeCalendarView = ({ schedule, startDate = new Date() }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formatLocalDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-CA'); 
  };

  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const scheduleMap = {};
  schedule.forEach(s => {
    const localDateStr = formatLocalDate(s.scheduleDate);
    if (!scheduleMap[localDateStr]) scheduleMap[localDateStr] = [];
    scheduleMap[localDateStr].push(s);
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dayStr = formatLocalDate(date); 
    const shifts = scheduleMap[dayStr] || [];

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

export default EmployeeCalendarView;
