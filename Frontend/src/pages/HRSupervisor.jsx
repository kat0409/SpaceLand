import React from 'react';
import AttendanceRevenue from '../components/AttendanceRevenue';
import VisitorRecords from '../components/VisitorRecords';
import EmployeeRecords from '../components/EmployeeRecords';


const HRSupervisor = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">HR Supervisor Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Attendance & Revenue Report</h2>
        <AttendanceRevenue />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Visitor Records</h2>
        <VisitorRecords />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Employee Records</h2>
        <EmployeeRecords />
      </section>
    </div>
  );
};

export default HRSupervisor;