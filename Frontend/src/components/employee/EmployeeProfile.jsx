import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function EmployeeProfile({ employee, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: employee?.FirstName || '',
    LastName: employee?.LastName || '',
    Email: employee?.Email || '',
    Address: employee?.Address || '',
    username: employee?.username || '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

      // Create update data object, excluding empty password
      const updateData = {
        EmployeeID: employee.EmployeeID,
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        Address: formData.Address,
        username: formData.username
      };

      // Only include password if it's not empty
      if (formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      const response = await fetch(`${BACKEND_URL}/supervisor/HR/update-employee-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          // Update the employee state with the new data while preserving other fields
          onUpdate({
            ...employee,
            ...updateData,
            password: undefined // Remove password from state
          });
          setIsEditing(false);
          // Show success popup
          setShowSuccessPopup(true);
          // Auto-hide popup after 3 seconds
          setTimeout(() => {
            setShowSuccessPopup(false);
          }, 3000);
        } else {
          throw new Error('Update failed');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 relative"
    >
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-purple-500 rounded-xl p-8 max-w-md mx-auto shadow-lg shadow-purple-500/30 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-300 mb-2">Profile Updated!</h2>
              <p className="text-gray-300 mb-6">Your profile information has been updated successfully.</p>
              <button 
                onClick={() => setShowSuccessPopup(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Address</label>
              <input
                type="text"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Full Name</p>
            <p className="text-lg">{employee?.FirstName} {employee?.LastName}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg">{employee?.Email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Address</p>
            <p className="text-lg">{employee?.Address}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Department</p>
            <p className="text-lg">{employee?.Department}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Username</p>
            <p className="text-lg">{employee?.username}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Employment Status</p>
            <p className="text-lg">{employee?.employmentStatus === 1 ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
} 