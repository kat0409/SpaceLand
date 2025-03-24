import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function MaintenanceSupervisorPortal() {
    const [rideMaintenanceReport, setRideMaintenanceReport] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/maintenance/ride-maintenance`)
        .then(res => res.json())
        .then(data => setRideMaintenanceReport(data));
    })

        return (
            <>
            <Header />
            <section className="min-h-screen px-6 py-20 text-white bg-gradient-to-b from-black via-gray-900 to-black">
                <h1 className="text-4xl font-bold mb-8 text-center">🛠 Maintenance Supervisor Portal</h1>
        
                {/* Ride Maintenance Report */}
                <div>
                <h2 className="text-2xl font-semibold mb-4">Ride Maintenance Report</h2>
                <table className="w-full text-sm bg-white/10 rounded-xl p-4">
                    <thead className="text-purple-300">
                    <tr>
                        <th>Ride</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Employee</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rideMaintenanceReport.map((item, idx) => (
                        <tr key={idx}>
                        <td>{item.Ride}</td>
                        <td>{new Date(item.Start_Date).toLocaleDateString()}</td>
                        <td>{new Date(item.End_Date).toLocaleDateString()}</td>
                        <td>{item.Maintenance_Employee}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </section>
            <Footer />
            </>
        );
}

