import { useEffect, useState } from "react";

export default function RideMaintenanceReport() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rides, setRides] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedRide, setSelectedRide] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/maintenance/rides`)
            .then(res => res.json())
            .then(setRides)
            .catch(console.error);
    }, []);

    // Helper function to format dates correctly
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        
        // Create a date object and adjust for timezone
        const date = new Date(dateString);
        
        // Format the date as MM/DD/YYYY
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC' // Use UTC to avoid timezone issues
        });
    };

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

    // Function to get status color class
    const getStatusColor = (status) => {
        status = (status || '').toLowerCase();
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-300';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-300';
            default:
                return 'bg-gray-500/20 text-gray-300';
        }
    };

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
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
                    <p>Loading maintenance report...</p>
                </div>
            )}
            {error && <p className="text-red-400 bg-red-900/20 p-4 rounded-lg">Error: {error}</p>}
            {!loading && !error && report.length === 0 && (
                <div className="bg-gray-900/30 rounded-lg p-8 text-center">
                    <p className="text-gray-400">No maintenance records found for the selected criteria.</p>
                </div>
            )}
            {report.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-purple-300 border-b border-white/10">
                            <tr>
                                <th className="p-2 text-left">Ride</th>
                                <th className="p-2 text-left">Assigned Employee</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Reason</th>
                                <th className="p-2 text-left">Start Date</th>
                                <th className="p-2 text-left">End Date</th>
                                <th className="p-2 text-left">Days Taken</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((item, idx) => (
                                <tr key={idx} className="border-b border-white/10 hover:bg-gray-700/30">
                                    <td className="p-2">{item.RideName}</td>
                                    <td className="p-2">{item.AssignedEmployee || 'Unassigned'}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                                            {item.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="p-2">{item.reason}</td>
                                    <td className="p-2">{formatDate(item.StartDate)}</td>
                                    <td className="p-2">{formatDate(item.EndDate)}</td>
                                    <td className="p-2">{item.DaysTaken}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}