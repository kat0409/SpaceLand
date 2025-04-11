import { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../components/AuthProvider';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function MaintenanceSupervisorPortal() {
  const { auth } = useContext(AuthContext);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated && auth.role === 'supervisor' && localStorage.getItem('department') === 'maintenance') {
      fetchMaintenanceData();
    }
  }, [auth]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Maintenance Supervisor Portal
        </motion.h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Maintenance Requests Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Maintenance Requests</h2>
            {loading ? (
              <p>Loading maintenance requests...</p>
            ) : (
              <div className="space-y-4">
                {maintenanceRequests.length > 0 ? (
                  maintenanceRequests.map((request, index) => (
                    <div 
                      key={request.RequestID || request.requestID || index}
                      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition cursor-pointer"
                      onClick={() => handleViewRequestDetails(request)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{request.RideName || request.rideName}</h3>
                          <p className="text-sm text-gray-400">
                            Status: {request.Status || request.status}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          (request.Priority || request.priority) === 'High' ? 'bg-red-500/20 text-red-300' :
                          (request.Priority || request.priority) === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {request.Priority || request.priority || 'Normal'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No maintenance requests found</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Ride Status Overview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Ride Status Overview</h2>
            {loading ? (
              <p>Loading ride status...</p>
            ) : (
              <div className="space-y-4">
                {rides.length > 0 ? (
                  rides.map((ride, index) => (
                    <div 
                      key={ride.RideID || ride.rideID || index}
                      className="bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{ride.RideName || ride.rideName || ride.Name || ride.name}</h3>
                          <p className="text-sm text-gray-400">
                            {ride.LastMaintenanceDate ? 
                              `Last Maintenance: ${new Date(ride.LastMaintenanceDate).toLocaleDateString()}` : 
                              'No maintenance record'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          (ride.Status || ride.status) === 'Operational' ? 'bg-green-500/20 text-green-300' :
                          (ride.Status || ride.status) === 'Maintenance' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {ride.Status || ride.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No rides found</p>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Maintenance Request Details Modal */}
        {showRequestDetails && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Maintenance Request Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Ride Information</h3>
                  <p>Name: {selectedRequest.RideName}</p>
                  <p>Type: {selectedRequest.RideType}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Request Details</h3>
                  <p>Priority: {selectedRequest.Priority}</p>
                  <p>Status: {selectedRequest.Status}</p>
                  <p>Description: {selectedRequest.Description}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Timeline</h3>
                  <p>Requested: {new Date(selectedRequest.RequestDate).toLocaleString()}</p>
                  {selectedRequest.CompletionDate && (
                    <p>Completed: {new Date(selectedRequest.CompletionDate).toLocaleString()}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowRequestDetails(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
                {selectedRequest.Status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleCompleteMaintenance(selectedRequest.RequestID);
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

