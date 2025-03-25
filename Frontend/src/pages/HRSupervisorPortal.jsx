import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function HRSupervisorPortal() {
    const [employees, setEmployees] = useState([]);
    const [visitorRecords, setVisitorRecords] = useState([]);
    const [attendanceAndRevenueReport, setAttendanceAndRevenueReport] = useState([]);

    const supervisorID = localStorage.getItem('supervisorID');

    useEffect (() => {
        fetch(`${BACKEND_URL}/supervisor/HR/employees`)
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error('Employees Error:', err));
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
        
                {/* Placeholder for Visitor Records */}
                <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Visitor Records (Coming Soon)</h2>
                <p className="text-gray-300">Visitor data will be displayed here once implemented.</p>
                </div>
        
                {/* Placeholder for Attendance and Revenue Report */}
                <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Attendance & Revenue Report (Coming Soon)</h2>
                <p className="text-gray-300">This section will show reports on attendance and earnings.</p>
                </div>
            </section>
            <Footer />
            </>
        );
}