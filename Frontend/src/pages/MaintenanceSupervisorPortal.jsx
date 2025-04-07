import { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MaintenanceRequestForm from './MaintenanceRequestForm';
import MarkMaintenanceCompletionForm from './MarkMaintenanceCompletionForm';
import { getMaintenanceRequests } from '../../../Backend/queries';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function MaintenanceSupervisorPortal() {
    const [rideMaintenanceReport, setRideMaintenanceReport] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const { auth } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated || auth.role !== 'supervisor'){
            navigate('/employee-login');
        }
    }, [auth, navigate]);

    const supervisorID = localStorage.getItem('supervisorID');

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/maintenance/ride-maintenance`)
            .then(res => res.json())
            .then(data => setRideMaintenanceReport(data));
        fetch(`${BACKEND_URL}/supervisor/maintenance/get-maintenance-requests`)
            .then((res) => res.json())
            .then((data) => setMaintenanceRequests(data))
            .catch((err) => console.error("Error fetching maintenance requests:", err));
    }, []);

    return (
        <>
            <Header />
            <section className="min-h-screen px-6 py-20 text-white bg-gradient-to-b from-black via-gray-900 to-black">
                <h1 className="text-4xl font-bold mb-8 text-center">🛠 Maintenance Supervisor Portal</h1>
        
                {/* Ride Maintenance Report */}
                <div className="mb-16">
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

                <div className="mb-16">
                <h2 className="text-2xl font-semibold mb-4">Ride Maintenance Report</h2>
                <table className="w-full text-sm bg-white/10 rounded-xl p-4">
                    <thead className="text-purple-300">
                    <tr>
                        <th>Ride Name</th>
                        <th>Ride ID</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Employee</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getMaintenanceRequests.map((item, idx) => (
                        <tr key={idx}>
                        <td>{item.RideName}</td>
                        <td>{item.rideID}</td>
                        <td>{item.status}</td>
                        <td>{item.reason}</td>
                        <td>{item.MaintenanceStartDate ? new Date(item.MaintenanceStartDate).toLocaleDateString() : '—'}</td>
                        <td>{item.MaintenanceEndDate ? new Date(item.MaintenanceEndDate).toLocaleDateString() : '—'}</td>
                        <td>{item.MaintenanceEmployeeID || 'Unassigned'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div className="p-6">
                    <MaintenanceRequestForm />
                </div>
                <div className="p-6">
                    <MarkMaintenanceCompletionForm />
                </div>
            </section>
            <Footer />
        </>
    );
}

