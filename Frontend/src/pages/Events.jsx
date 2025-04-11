// src/pages/Auth.jsx
import { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from '../components/AuthProvider';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function Events() {
  const { auth } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    durationMin: '',
    description: '',
    event_date: '',
    type: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/get-events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingId 
        ? `${BACKEND_URL}/supervisor/HR/update-event`
        : `${BACKEND_URL}/supervisor/HR/add-events`;
      
      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? { ...formData, eventID: editingId } : formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        eventName: '',
        durationMin: '',
        description: '',
        event_date: '',
        type: ''
      });
      fetchEvents();
    } catch (err) {
      setError('Failed to save event. Please try again.');
      console.error('Error saving event:', err);
    }
  };

  const handleDelete = async (eventID) => {
    try {
      const response = await fetch(`${BACKEND_URL}/supervisor/HR/delete-event`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventID }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      fetchEvents();
    } catch (err) {
      setError('Failed to delete event. Please try again.');
      console.error('Error deleting event:', err);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.eventID);
    setFormData({
      eventName: event.eventName,
      durationMin: event.durationMin,
      description: event.description,
      event_date: event.event_date.split('T')[0],
      type: event.type
    });
    setShowModal(true);
  };

  const isSupervisor = auth.isAuthenticated && auth.role === 'supervisor';

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Events</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {isSupervisor && (
          <button
            onClick={() => setShowModal(true)}
            className="mb-6 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Add Event
          </button>
        )}

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <div key={event.eventID} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{event.eventName}</h3>
                <p className="text-gray-300 mb-2">{event.description}</p>
                <p className="text-sm text-gray-400 mb-2">
                  Date: {formatDate(event.event_date)}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  Duration: {event.durationMin} minutes
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Type: {event.type}
                </p>
                {isSupervisor && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.eventID)}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Edit Event' : 'Add Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Event Name</label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.durationMin}
                    onChange={(e) => setFormData({...formData, durationMin: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Show">Show</option>
                    <option value="Performance">Performance</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Special Event">Special Event</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setFormData({
                        eventName: '',
                        durationMin: '',
                        description: '',
                        event_date: '',
                        type: ''
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                  >
                    {editingId ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}