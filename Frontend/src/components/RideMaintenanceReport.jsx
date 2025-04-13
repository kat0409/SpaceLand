import { useEffect, useState } from "react";

export default function RideMaintenanceReport() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/maintenance/ride-maintenance`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch report");
                return res.json();
            })
            .then(data => setReport(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Ride Maintenance Report</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            {!loading && !error && report.length === 0 && <p>No maintenance records found.</p>}
            {report.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-purple-300">
                            <tr>
                                <th className="text-left">Ride</th>
                                <th className="text-left">Assigned Employee</th>
                                <th>Status</th>
                                <th>Reason</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Days Taken</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((item, idx) => (
                                <tr key={idx} className="border-t border-white/10">
                                    <td>{item.RideName}</td>
                                    <td>{item.AssignedEmployee}</td>
                                    <td>{item.status}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.StartDate}</td>
                                    <td>{item.EndDate}</td>
                                    <td>{item.DaysTaken}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
