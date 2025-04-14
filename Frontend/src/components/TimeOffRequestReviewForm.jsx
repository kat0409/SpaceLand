import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function TimeOffRequestReviewForm() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load all requests
  const fetchRequests = () => {
    fetch(`${BACKEND_URL}/supervisor/HR/time-off-request`)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => {
        console.error("Error loading time off requests:", err);
        setMessage({ text: 'Failed to load time off requests', type: 'error' });
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestID, action) => {
    const confirm = window.confirm(`Are you sure you want to ${action} this request?`);
    if (!confirm) return;

    const res = await fetch(`${BACKEND_URL}/supervisor/HR/update-time-off-request`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestID, status: action }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ text: data.message, type: 'success' });
      fetchRequests(); // Refresh list
    } else {
      setMessage({ text: data.error || 'Failed to update request', type: 'error' });
    }
  };

  return (
    <div className="bg-white/10 p-4 rounded-xl space-y-4">
      <h3 className="text-lg font-bold">Time Off Requests</h3>

      {message.text && (
        <div
          className={`p-2 rounded ${
            message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          {message.text}
        </div>
      )}

      <table className="w-full text-sm text-left border-separate border-spacing-y-2">
        <thead className="text-purple-300">
          <tr>
            <th>Employee</th>
            <th>Dates</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.requestID} className="bg-white/5 rounded-lg">
              <td className="p-2">{r.FirstName} {r.LastName}</td>
              <td className="p-2">{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</td>
              <td className="p-2">{r.reason}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2 space-x-2">
                {r.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(r.requestID, 'approved')}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(r.requestID, 'denied')}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Deny
                    </button>
                  </>
                )}
                {r.status !== 'pending' && (
                  <span className="text-gray-300 italic">No action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}