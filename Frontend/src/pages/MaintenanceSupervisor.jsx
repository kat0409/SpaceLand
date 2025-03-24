import React from 'react';
import RideMaintenanceReport from '../components/RideMaintenanceReport';

const MaintenanceSupervisor = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Maintenance Supervisor Dashboard</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Ride Maintenance Report</h2>
        <RideMaintenanceReport />
      </section>
    </div>
  );
};

export default MaintenanceSupervisor;