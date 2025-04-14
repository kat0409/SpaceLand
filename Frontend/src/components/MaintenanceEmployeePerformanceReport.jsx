import { useEffect, useState } from "react";

export default function MaintenanceEmployeePerformanceReport() {
    const [report, setReport] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("0");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/employees?department=Maintenance`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setEmployees(data);
            })
            .catch(err => console.error("Failed to fetch employees:", err));
    }, []);

    const fetchReport = () => {
        setLoading(true);
        const url = `${BACKEND_URL}/supervisor/maintenance/employee-performance?EmployeeID=${selectedEmployee}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch performance report");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setReport(data);
                    setError(null);
                } else if (data.message === "No performance data found") {
                    setReport([]);
                    setError(null);
                } else {
                    throw new Error("Unexpected response format");
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReport();
    }, []); // Initial load

    return (
        <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🧑‍🔧 Employee Performance Report</h2>

            {/* Filter */}
            <div className="flex gap-4 mb-6 items-center">
                <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="p-2 rounded bg-black text-white"
                >
                    <option value="0">All Maintenance Employees</option>
                    {employees.map(emp => (
                        <option key={emp.EmployeeID} value={emp.EmployeeID}>
                            {emp.FirstName} {emp.LastName}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={fetchReport} 
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                >
                    Apply Filter
                </button>
            </div>

            {/* Error or Loading */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            {!loading && !error && report.length === 0 && <p>No performance data found.</p>}

            {/* Report Table */}
            {report.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-purple-300">
                            <tr>
                                <th>Employee</th>
                                <th>Total Tasks</th>
                                <th>Completed</th>
                                <th>Avg Days to Complete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((row, idx) => (
                                <tr key={idx} className="border-t border-white/10">
                                    <td>{row.EmployeeName}</td>
                                    <td>{row.TotalTasks}</td>
                                    <td>{row.CompletedTasks}</td>
                                    <td>{row.AvgDaysToComplete}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}