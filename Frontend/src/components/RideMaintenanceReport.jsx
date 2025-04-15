import { useEffect, useState } from "react";

export default function RideMaintenanceReport() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rides, setRides] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedRide, setSelectedRide] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/maintenance/rides`)
            .then(res => res.json())
            .then(setRides)
            .catch(console.error);
    }, []);

    const fetchReport = () => {
        setLoading(true);
        setError(null); // reset error on each fetch

        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (selectedRide) params.append('rideID', selectedRide);

        const url = `${BACKEND_URL}/supervisor/maintenance/ride-maintenance?${params.toString()}`;

        fetch(url)
            .then(async (res) => {
                if (res.status === 404) {
                    return { empty: true };
                }
                if (!res.ok) {
                    throw new Error("Failed to fetch report");
                }
                const data = await res.json();
                return data;
            })
            .then((data) => {
                if (data.empty) {
                    setReport([]);
                    setError(null);
                } else if (Array.isArray(data)) {
                    setReport(data);
                    setError(null);
                } else {
                    throw new Error("Unexpected response format");
                }
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setReport([]);
            })
            .finally(() => setLoading(false));
    };      

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Ride Maintenance Report</h2>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="p-2 rounded bg-black text-white"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="p-2 rounded bg-black text-white"
                />
                <select
                    value={selectedRide}
                    onChange={e => setSelectedRide(e.target.value)}
                    className="p-2 rounded bg-black text-white"
                >
                    <option value="">All Rides</option>
                    {rides.map(ride => (
                        <option key={ride.RideID} value={ride.RideID}>
                            {ride.RideName}
                        </option>
                    ))}
                </select>
                <button onClick={fetchReport} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white">
                    Apply Filters
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            {!loading && !error && report.length === 0 && <p>No maintenance records found.</p>}
            {report.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-purple-300">
                            <tr>
                                <th>Ride</th>
                                <th>Assigned Employee</th>
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
