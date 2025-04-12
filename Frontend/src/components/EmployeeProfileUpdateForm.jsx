import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function EmployeeProfileUpdateForm() {
    const [formData, setFormData] = useState({
        EmployeeID: '',
        FirstName: '',
        LastName: '',
        Email: '',
        Address: '',
        username: '',
        password: '',
        Department: '',
        employmentStatus: true,
        SupervisorID: ''
    });

    const [departments, setDepartments] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch departments and supervisors when component mounts
        fetch(`${BACKEND_URL}/supervisor/HR/get-departments`)
            .then(res => res.json())
            .then(data => setDepartments(data))
            .catch(err => console.error('Error fetching departments:', err));

        fetch(`${BACKEND_URL}/supervisor/HR/get-supervisors`)
            .then(res => res.json())
            .then(data => setSupervisors(data))
            .catch(err => console.error('Error fetching supervisors:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });
    
        try {
            if (!formData.EmployeeID) {
                setMessage({ text: 'Employee ID is required', type: 'error' });
                return;
            }
    
            // Build object only with fields that were actually filled
            const dataToSend = {
                EmployeeID: formData.EmployeeID,
                ...(formData.FirstName && { FirstName: formData.FirstName }),
                ...(formData.LastName && { LastName: formData.LastName }),
                ...(formData.Email && { Email: formData.Email }),
                ...(formData.Address && { Address: formData.Address }),
                ...(formData.username && { username: formData.username }),
                ...(formData.password && { password: formData.password }),
                ...(formData.Department && { Department: formData.Department }),
                ...(formData.SupervisorID && { SupervisorID: formData.SupervisorID }),
                employmentStatus: formData.employmentStatus ? 1 : 0
            };
    
            // Check if only EmployeeID was provided
            const keys = Object.keys(dataToSend);
            if (keys.length === 1 && keys[0] === 'EmployeeID') {
                setMessage({ text: 'Please provide at least one field to update', type: 'error' });
                return;
            }
    
            const response = await fetch(`${BACKEND_URL}/supervisor/HR/update-employee-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage({ text: 'Employee profile updated successfully!', type: 'success' });
                setFormData(prev => ({
                    ...prev,
                    FirstName: '',
                    LastName: '',
                    Email: '',
                    Address: '',
                    username: '',
                    password: '',
                    Department: '',
                    employmentStatus: true,
                    SupervisorID: ''
                }));
            } else {
                setMessage({ text: data.error || 'Failed to update employee profile', type: 'error' });
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };    

    return (
        <div className="bg-white/10 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-purple-300">Update Employee Profile</h2>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Employee ID *</label>
                        <input
                            type="text"
                            name="EmployeeID"
                            value={formData.EmployeeID}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                        <input
                            type="text"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                        <input
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                        <select
                            name="Department"
                            value={formData.Department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.departmentIDNumber} value={dept.DepartmentName}>
                                    {dept.DepartmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Supervisor</label>
                        <select
                            name="SupervisorID"
                            value={formData.SupervisorID}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        >
                            <option value="">Select Supervisor</option>
                            {supervisors.map(sup => (
                                <option key={sup.SupervisorID} value={sup.SupervisorID}>
                                    {sup.FirstName} {sup.LastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="employmentStatus"
                            checked={formData.employmentStatus}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 rounded"
                        />
                        <label className="text-sm font-medium text-gray-300">Active Employment Status</label>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                            isLoading 
                                ? 'bg-purple-700 cursor-not-allowed' 
                                : 'bg-purple-600 hover:bg-purple-700'
                        } transition-colors duration-200`}
                    >
                        {isLoading ? 'Updating...' : 'Update Employee Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}