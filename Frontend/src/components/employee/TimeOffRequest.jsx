import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TimeOffRequest({ employeeID }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'vacation', // vacation, sick, personal
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';
      const response = await fetch(`${BACKEND_URL}/employee/time-off-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmployeeID: employeeID,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Time off request submitted successfully!'
        });
        setFormData({
          startDate: '',
          endDate: '',
          reason: '',
          type: 'vacation'
        });
      } else {
        throw new Error(data.error || 'Failed to submit request');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to submit request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10"
    >
      <h2 className="text-2xl font-bold mb-6">Request Time Off</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Type of Leave</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Leave</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            placeholder="Please provide a brief explanation..."
            required
          />
        </div>

        {status.message && (
          <div
            className={`p-4 rounded-lg ${
              status.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </motion.div>
  );
} 