import { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../components/AuthProvider';
import { motion } from 'framer-motion';
import MaintenanceRequestForm from "./MaintenanceRequestForm";
import MarkMaintenanceCompletionForm from "./MarkMaintenanceCompletionForm";
import RideMaintenanceReport from "../components/RideMaintenanceReport";
import MaintenanceEmployeePerformanceReport from "../components/MaintenanceEmployeePerformanceReport";
import WeatherAlertManager from "../components/WeatherAlertManager";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function MaintenanceSupervisorPortal() {
  const { auth, logout } = useContext(AuthContext);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requestFilter, setRequestFilter] = useState({
    status: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    if (auth.isAuthenticated && auth.role === 'supervisor' && localStorage.getItem('department') === 'maintenance') {
      fetchMaintenanceData();
    }
  }, [auth]);

  useEffect(() => {
    // Apply filters to maintenance requests
    let result = [...maintenanceRequests];
    
    // Filter by status
    if (requestFilter.status !== 'all') {
      result = result.filter(request => 
        (request.status || '').toLowerCase() === requestFilter.status.toLowerCase()
      );
    }
    
    // Sort requests
    if (requestFilter.sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = new Date(a.MaintenanceStartDate || '');
        const dateB = new Date(b.MaintenanceStartDate || '');
        return dateB - dateA; // Newest first
      });
    } else if (requestFilter.sortBy === 'oldest') {
      result.sort((a, b) => {
        const dateA = new Date(a.MaintenanceStartDate || '');
        const dateB = new Date(b.MaintenanceStartDate || '');
        return dateA - dateB; // Oldest first
      });
    }
    
    setFilteredRequests(result);
  }, [maintenanceRequests, requestFilter]);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch maintenance requests
      const requestsResponse = await fetch(`${BACKEND_URL}/supervisor/maintenance/get-maintenance-requests`);
      if (!requestsResponse.ok) {
        console.error('Maintenance requests response not OK:', requestsResponse.status);
        throw new Error(`Failed to fetch maintenance requests: ${requestsResponse.status}`);
      }
      
      // Fetch rides
      const ridesResponse = await fetch(`${BACKEND_URL}/rides`);
      if (!ridesResponse.ok) {
        console.error('Rides response not OK:', ridesResponse.status);
        throw new Error(`Failed to fetch rides: ${ridesResponse.status}`);
      }
      
      const requestsData = await requestsResponse.json();
      const ridesData = await ridesResponse.json();
      
      console.log('Maintenance Requests:', requestsData);
      console.log('Rides Data:', ridesData);
      
      // Check if the data has the expected structure
      if (Array.isArray(requestsData)) {
        setMaintenanceRequests(requestsData);
      } else {
        console.error('Unexpected maintenance requests data structure:', requestsData);
        setMaintenanceRequests([]);
      }
      
      if (Array.isArray(ridesData)) {
        setRides(ridesData);
      } else {
        console.error('Unexpected rides data structure:', ridesData);
        setRides([]);
      }
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
      setError(err.message || 'Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  };

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

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    
    // Create a date object and adjust for timezone
    const date = new Date(dateString);
    
    // Format the date and time
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Use UTC to avoid timezone issues
    });
  };

  const handleCompleteMaintenance = async (requestId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/supervisor/maintenance/complete-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete maintenance request');
      }

      // Refresh maintenance data
      fetchMaintenanceData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setRequestFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

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

  // Function to get ride name from ride ID
  const getRideName = (rideId) => {
    const ride = rides.find(r => r.RideID === rideId || r.rideID === rideId);
    return ride ? (ride.RideName || ride.name) : `Ride #${rideId}`;
  };

  if (!auth.isAuthenticated || auth.role !== 'supervisor' || localStorage.getItem('department') !== 'maintenance') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p>You must be logged in as a maintenance supervisor to access this portal.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get counts of maintenance requests by status
  const pendingCount = maintenanceRequests.filter(r => 
    (r.status || '').toLowerCase() === 'pending'
  ).length;
  
  const completedCount = maintenanceRequests.filter(r => 
    (r.status || '').toLowerCase() === 'completed'
  ).length;

  // Get total count
  const totalCount = maintenanceRequests.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center"
          >
            Maintenance Supervisor Portal
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
          >
            Logout
          </motion.button>
        </div>

        <div className="flex justify-center mb-10 space-x-4">
          {[
            { key: 'dashboard', label: 'Dashboard' },
            { key: 'report', label: 'Ride Maintenance Report' },
            { key: 'performance', label: 'Employee Performance' },
            { key: 'weather', label: 'Weather Alerts' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full transition ${
                activeTab === tab.key
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            {/* Maintenance Request Form (optional) */}
            <div className="mb-10">
              <MaintenanceRequestForm />
            </div>
            {/* Mark Maintenance Completion Form */}
            <div className="mb-10">
              <MarkMaintenanceCompletionForm />
            </div>
            {/* Dashboard grid view */}
            <div className="grid grid-cols-1 gap-8">
              {/* Maintenance Request Status Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/50 rounded-xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Maintenance Request Status</h2>
                  <button
                    onClick={fetchMaintenanceData}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition text-sm"
                  >
                    Refresh Data
                  </button>
                </div>
                
                {/* Status Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-800/30 border border-yellow-600/30 rounded-lg p-3 text-center">
                    <h3 className="text-yellow-300 text-lg font-semibold">Pending</h3>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                  </div>
                  <div className="bg-green-800/30 border border-green-600/30 rounded-lg p-3 text-center">
                    <h3 className="text-green-300 text-lg font-semibold">Completed</h3>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </div>
                  <div className="bg-purple-800/30 border border-purple-600/30 rounded-lg p-3 text-center">
                    <h3 className="text-purple-300 text-lg font-semibold">Total</h3>
                    <p className="text-2xl font-bold">{totalCount}</p>
                  </div>
                </div>
                
                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Filter by Status</label>
                    <select
                      name="status"
                      value={requestFilter.status}
                      onChange={handleFilterChange}
                      className="w-full p-2 bg-gray-900/50 border border-gray-700 rounded text-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Sort By</label>
                    <select
                      name="sortBy"
                      value={requestFilter.sortBy}
                      onChange={handleFilterChange}
                      className="w-full p-2 bg-gray-900/50 border border-gray-700 rounded text-white"
                    >
                      <option value="newest">Date (Newest First)</option>
                      <option value="oldest">Date (Oldest First)</option>
                    </select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
                    <p>Loading maintenance requests...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {filteredRequests.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead className="text-left text-purple-300 border-b border-white/10">
                          <tr>
                            <th className="p-2">Ride</th>
                            <th className="p-2">Issue</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRequests.map((request, index) => (
                            <tr 
                              key={request.maintenanceID || index}
                              className="border-b border-white/10 hover:bg-gray-700/30"
                            >
                              <td className="p-2 font-semibold">
                                {getRideName(request.rideID)}
                              </td>
                              <td className="p-2">
                                {request.reason || 'No reason provided'}
                              </td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                                  {request.status || 'Unknown'}
                                </span>
                              </td>
                              <td className="p-2">
                                {formatDate(request.MaintenanceStartDate)}
                              </td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleViewRequestDetails(request)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition text-xs mr-2"
                                >
                                  Details
                                </button>
                                {(request.status === 'pending') && (
                                  <button
                                    onClick={() => handleCompleteMaintenance(request.maintenanceID)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition text-xs"
                                  >
                                    Complete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="bg-gray-900/30 rounded-lg p-8 text-center">
                        <p className="text-gray-400">No maintenance requests found matching your filters.</p>
                        {requestFilter.status !== 'all' ? (
                          <button
                            onClick={() => setRequestFilter({ status: 'all', sortBy: 'newest' })}
                            className="mt-2 text-purple-400 hover:text-purple-300 underline"
                          >
                            Clear filters
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}

        {activeTab === 'report' && (
          <div className="bg-gray-800/50 rounded-lg p-6 text-center">
            <RideMaintenanceReport />
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-gray-800/50 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Employee Performance</h2>
            <MaintenanceEmployeePerformanceReport />
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="bg-gray-800/50 rounded-lg p-6">
            <WeatherAlertManager />
          </div>
        )}

        {/* Maintenance Request Details Modal */}
        {showRequestDetails && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Maintenance Request Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Ride Information</h3>
                  <p>Name: {getRideName(selectedRequest.rideID)}</p>
                  <p>Ride ID: {selectedRequest.rideID || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Request Details</h3>
                  <p>Status: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status || 'Unknown'}
                    </span>
                  </p>
                  <p>Issue: {selectedRequest.reason || 'No description provided'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Timeline</h3>
                  <p>Requested: {formatDateTime(selectedRequest.MaintenanceStartDate)}</p>
                  {selectedRequest.MaintenanceEndDate && (
                    <p>Completed: {formatDateTime(selectedRequest.MaintenanceEndDate)}</p>
                  )}
                </div>
                {selectedRequest.MaintenanceEmployeeID && (
                  <div>
                    <h3 className="font-semibold">Assignment</h3>
                    <p>Assigned to Employee ID: {selectedRequest.MaintenanceEmployeeID}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowRequestDetails(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
                {selectedRequest.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleCompleteMaintenance(selectedRequest.maintenanceID);
                      setShowRequestDetails(false);
                    }}
                    className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
