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
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    capacity: '',
    price: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/supervisor/events/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      setShowAddEventModal(false);
      setNewEvent({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
        capacity: '',
        price: ''
      });
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isSupervisor = auth.isAuthenticated && auth.role === 'supervisor';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          SpaceLand Events
        </motion.h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {isSupervisor && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              Add New Event
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/50 rounded-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={event.imageUrl || 'https://via.placeholder.com/400x200'}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-xl font-bold">{event.name}</h3>
                    <p className="text-sm text-gray-300">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {event.location}
                    </span>
                    <span className="text-sm font-semibold">
                      ${event.price}
                    </span>
                  </div>
                  {isSupervisor && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Event Modal */}
        {showAddEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block mb-1">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newEvent.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={newEvent.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={newEvent.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={newEvent.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddEventModal(false)}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}