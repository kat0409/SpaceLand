import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function HRSupervisorPortal() {
    const [employees, setEmployees] = useState([]);
    const [visitorRecords, setVisitorRecords] = useState([]);
    const [attendanceAndRevenueReport, setAttendanceAndRevenueReport] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        weatherCondition: ''
    });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const fetchFilteredReport = () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.weatherCondition) params.append('weatherCondition', filters.weatherCondition);

        fetch(`${BACKEND_URL}/supervisor/HR/attendance-revenue${params.toString()}`)
            .then(res => res.json())
            .then(data => setAttendanceAndRevenueReport(data))
            .catch(err => console.error('Attendance and Revenue Report error: ', err));
    };

    const supervisorID = localStorage.getItem('supervisorID');

    useEffect (() => {
        fetch(`${BACKEND_URL}/supervisor/HR/employees`)
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error('Employees Error:', err));
        fetch(`${BACKEND_URL}/supervisor/HR/attendance-revenue`)
            .then(res => res.json())
            .then(data => setAttendanceAndRevenueReport(data))
            .catch(err => console.error('Attendance and Revenue Report Error:', err));
        fetch(`${BACKEND_URL}/supervisor/HR/visitors`)
            .then(res => res.json())
            .then(data => setVisitorRecords(data))
            .catch(err => console.error('Visitor Records Error:', err));
        fetchFilteredReport();
    }, []);

    return (
        <>
            <Header />
            <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
                <h1 className="text-4xl font-bold mb-8 text-center">👥 HR Supervisor Portal</h1>
        
                {/* Employee List */}
                <div className="space-y-12">
                <h2 className="text-2xl font-semibold mb-4">Employee List</h2>
                <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead className="text-left text-purple-300">
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Username</th>
                        <th>Department</th>
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                        <tr key={emp.EmployeeID} className="border-t border-white/10">
                            <td>{emp.EmployeeID}</td>
                            <td>{emp.FirstName} {emp.LastName}</td>
                            <td>{emp.Email}</td>
                            <td>{emp.Address}</td>
                            <td>{emp.username}</td>
                            <td>{emp.Department}</td>
                            <td>{emp.employmentStatus ? 1 : 0}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
        
                {/* Attendance and Revenue Report */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">📊 Attendance & Revenue Report</h2>
                    <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
                    {attendanceAndRevenueReport.length > 0 ? (
                        <table className="w-full text-sm">
                        <thead className="text-left text-purple-300">
                            <tr>
                            <th>Operating Date</th>
                            <th>Tickets Sold</th>
                            <th>Total Ticket Revenue</th>
                            <th>Weather Condition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceAndRevenueReport.map((entry, idx) => (
                            <tr key={idx} className="border-t border-white/10">
                                <td>{new Date(entry.Operating_Date).toLocaleDateString()}</td>
                                <td>{entry.Tickets_Sold}</td>
                                <td>${(parseFloat(entry.Total_Ticket_Revenue) || 0).toFixed(2)}</td>
                                <td>{entry.Weather_Condition}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    ) : (
                        <p>No attendance or revenue data available.</p>
                    )}
                    </div>
                </div>

                {/* VISITOR RECORDS */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">📋 Visitor Records</h2>
                    <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-purple-300">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Military</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visitorRecords.map(visitor => (
                            <tr key={visitor.VisitorID} className="border-t border-white/10">
                            <td>{visitor.FirstName} {visitor.LastName}</td>
                            <td>{visitor.Email}</td>
                            <td>{visitor.Username}</td>
                            <td>{visitor.MilitaryStatus ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </section>
            <Footer />
            </>
        );
}