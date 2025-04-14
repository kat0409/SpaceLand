import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import EmployeeManagement from './EmployeeManagement';
import EmployeeScheduleDisplay from '../components/EmployeeScheduleDisplay';
import DeleteScheduleForm from '../components/DeleteScheduleForm';
import EmployeeProfileForm from '../components/EmployeeProfileUpdateForm';
import FireEmployeeForm from '../components/FireEmployeeForm';
import TimeOffRequestReviewForm from '../components/TimeOffRequestReviewForm';
import ScheduleForm from '../components/ScheduleForm';
import CalendarView from '../components/HRCalendarView';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function HRSupervisorPortal() {
    const { auth } = useContext(AuthContext)
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("scheduling");
    const [refreshKey, setRefreshKey] = useState(Date.now());
    const [schedules, setSchedules] = useState([]);

    console.log('HRSupervisorPortal rendered with auth:', auth);

    const [employees, setEmployees] = useState([]);
    const [visitorRecords, setVisitorRecords] = useState([]);
    const [attendanceAndRevenueReport, setAttendanceAndRevenueReport] = useState([]);
    const {logout} = useContext(AuthContext);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        weatherCondition: ''
    });

    useEffect(() => {
        console.log('Auth effect triggered with auth:', auth);
        
        // Check if auth is initialized
        if (auth.role === null) {
            console.log('Auth not initialized yet');
            return; // Wait for auth to be initialized
        }

        if(!auth.isAuthenticated || auth.role !== "supervisor"){
            console.log('Not authenticated or not supervisor, redirecting to login');
            navigate('/employee-login');
        } else {
            console.log('Authentication successful, setting loading to false');
            setIsLoading(false);
        }
    }, [auth, navigate]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/supervisor/HR/get-schedule`)
            .then(res => res.json())
            .then(data => {
                setSchedules(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch schedule:", err);
                setIsLoading(false);
            });
    }, [refreshKey]);

    useEffect(() => {
        console.log('Data fetching effect triggered');
        if (!isLoading) {
            console.log('Fetching data because not loading');
            fetch(`${BACKEND_URL}/supervisor/HR/employees`)
                .then(res => res.json())
                .then(data => {
                    console.log('Employees data fetched:', data);
                    setEmployees(data);
                })
                .catch(err => console.error('Employees Error:', err));
            
            fetch(`${BACKEND_URL}/supervisor/HR/attendance-revenue`)
                .then(res => res.json())
                .then(data => {
                    console.log('Attendance data fetched:', data);
                    setAttendanceAndRevenueReport(data);
                })
                .catch(err => console.error('Attendance and Revenue Report Error:', err));
            
            fetch(`${BACKEND_URL}/supervisor/HR/visitors`)
                .then(res => res.json())
                .then(data => {
                    console.log('Visitor data fetched:', data);
                    setVisitorRecords(data);
                })
                .catch(err => console.error('Visitor Records Error:', err));
            
            fetchFilteredReport();
        }
    }, [isLoading]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const fetchFilteredReport = () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.weatherCondition) params.append('weatherCondition', filters.weatherCondition);

        fetch(`${BACKEND_URL}/supervisor/HR/attendance-revenue?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                console.log('Filtered report data fetched:', data);
                setAttendanceAndRevenueReport(data);
            })
            .catch(err => console.error('Attendance and Revenue Report error: ', err));
    };

    console.log('Current loading state:', isLoading);

    if (isLoading) {
        console.log('Rendering loading state');
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    console.log('Rendering main content');
    return (
        <>
            <Header />
            <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
                <h1 className="text-4xl font-bold mb-8 text-center">👥 HR Supervisor Portal</h1>

                <div className="flex flex-wrap border-b border-gray-700 mb-6">
                    <button 
                        className={`py-2 px-4 font-medium ${activeTab === 'scheduling' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('scheduling')}
                    >
                        Scheduling
                    </button>

                    <button 
                        className={`py-2 px-4 font-medium ${activeTab === 'employeeManagement' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('employeeManagement')}
                    >
                        Employee Management
                    </button>

                    <button 
                        className={`py-2 px-4 font-medium ${activeTab === 'attendance' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        Attendance Report
                    </button>
                </div>

                {activeTab === 'scheduling' && (
                    <div className="space-y-6">
                        <CalendarView schedule={schedules} />
                        <ScheduleForm onScheduleAdded={() => setRefreshKey(Date.now())} />
                        <DeleteScheduleForm onScheduleDeleted={() => setRefreshKey(Date.now())} />
                        <EmployeeScheduleDisplay refreshKey={refreshKey} />
                        <TimeOffRequestReviewForm/>
                    </div>
                )}

                {activeTab === 'employeeManagement' && (
                    <div>
                        <EmployeeProfileForm/>
                        <FireEmployeeForm/>
                        {/* Place employee profile filtering/editing UI here */}
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div>
                        {/* Place attendance and revenue report UI here */}
                    </div>
                )}
        
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
                <div className="p-6">
                    <EmployeeManagement />
                </div>
                <div className="mb-4 space-x-4">
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="bg-white/20 text-white p-2 rounded"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="bg-white/20 text-white p-2 rounded"
                    />
                    <select
                        name="weatherCondition"
                        value={filters.weatherCondition}
                        onChange={handleFilterChange}
                        className="bg-white/20 text-white p-2 rounded"
                    >
                        <option value="">All Weather</option>
                        <option value="Sunny">Sunny</option>
                        <option value="Cloudy">Cloudy</option>
                        <option value="Rainy">Rainy</option>
                        <option value="Stormy">Stormy</option>
                    </select>
                    <button onClick={fetchFilteredReport} className="bg-purple-600 text-white p-2 rounded">
                        Apply Filters
                    </button>
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
                <button
                    onClick={() => {
                        logout();
                        window.location.href = "/employee-login"
                    }}
                    className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
                >
                    Logout
                </button>
            </section>
            <Footer />
        </>
    );
}