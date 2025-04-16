import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

const WeatherAlertManager = () => {
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchWeatherAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/weather-alert`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather alerts');
      }
      const data = await response.json();
      setWeatherAlerts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherAlerts();
  }, []);

  const handleResolveAlert = async (alertID) => {
    try {
      const response = await fetch(`${BACKEND_URL}/resolve-weather-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertID }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve weather alert');
      }

      // Remove the resolved alert from the list
      setWeatherAlerts(prevAlerts => prevAlerts.filter(alert => alert.alertID !== alertID));
      setSuccessMessage('Alert resolved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error resolving weather alert:', err);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">⚠️ Weather Alerts Management</h2>
      
      {successMessage && (
        <div className="bg-green-800/30 border border-green-600 text-green-200 p-4 rounded-lg mb-4">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-800/30 border border-red-600 text-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="py-4 text-center">Loading weather alerts...</div>
      ) : weatherAlerts.length === 0 ? (
        <div className="bg-gray-800/50 p-4 rounded-lg text-center">
          <p className="text-gray-400">No active weather alerts at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-purple-300">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Alert Message</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weatherAlerts.map((alert) => (
                <tr key={alert.alertID} className="border-t border-white/10">
                  <td className="p-2">{alert.alertID}</td>
                  <td className="p-2">{alert.alertMessage}</td>
                  <td className="p-2">{new Date(alert.timestamp).toLocaleString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alert.isResolved ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'
                    }`}>
                      {alert.isResolved ? 'Resolved' : 'Active'}
                    </span>
                  </td>
                  <td className="p-2">
                    {!alert.isResolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.alertID)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button 
          onClick={fetchWeatherAlerts}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Refresh Alerts
        </button>
      </div>
    </div>
  );
};

export default WeatherAlertManager; 