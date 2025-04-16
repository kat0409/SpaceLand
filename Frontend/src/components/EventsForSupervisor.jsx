import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function EventsForSupervisor() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [newEvent, setNewEvent] = useState({
        eventName: '',
        durationMin: '',
        description: '',
        event_date: '',
        type: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/get-events`);
            if (!res.ok) throw new Error("Failed to fetch events");
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/supervisor/HR/add-events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent)
            });
            if (!res.ok) throw new Error("Failed to add event");
            setNewEvent({ eventName: '', durationMin: '', description: '', event_date: '', type: '' });
            fetchEvents();
        } catch (err) {
            setError(err.message);
        }
    };
    
    // Show confirmation dialog
    const promptDeleteConfirmation = (event) => {
        setEventToDelete(event);
        setShowConfirmation(true);
    };
    
    // Cancel deletion
    const cancelDelete = () => {
        setShowConfirmation(false);
        setEventToDelete(null);
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        
        try {
            const res = await fetch(`${BACKEND_URL}/supervisor/HR/delete-event?eventID=${eventToDelete.eventID}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error("Failed to delete event");
            fetchEvents();
            setShowConfirmation(false);
            setEventToDelete(null);
        } catch (err) {
            setError(err.message);
            setShowConfirmation(false);
        }
    };

    return (
        <div className="text-white">
            {/* Confirmation Dialog */}
            {showConfirmation && eventToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
                    <div className="bg-gradient-to-b from-gray-900 to-black border border-red-500 rounded-xl p-6 max-w-md mx-auto shadow-lg shadow-red-500/30">
                        <h3 className="text-xl font-bold text-red-400 mb-3">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete the event "{eventToDelete.eventName}"? This action cannot be undone.</p>
                        <div className="flex space-x-4">
                            <button 
                                onClick={cancelDelete} 
                                className="flex-1 px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteEvent} 
                                className="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Manage Events</h2>

            <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input type="text" placeholder="Event Name" required value={newEvent.eventName} onChange={e => setNewEvent({ ...newEvent, eventName: e.target.value })} className="p-2 rounded bg-black/40" />
                <input type="date" required value={newEvent.event_date} onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })} className="p-2 rounded bg-black/40" />
                <input type="number" placeholder="Duration (min)" required value={newEvent.durationMin} onChange={e => setNewEvent({ ...newEvent, durationMin: e.target.value })} className="p-2 rounded bg-black/40" />
                <input type="text" placeholder="Type" required value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="p-2 rounded bg-black/40" />
                <textarea placeholder="Description" required value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="p-2 rounded bg-black/40 md:col-span-2" />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white md:col-span-2">Add Event</button>
            </form>

            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p className="text-red-400">{error}</p>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <motion.div key={event.eventID} className="bg-white/5 p-4 rounded shadow">
                            <h3 className="font-bold text-lg">{event.eventName}</h3>
                            <p className="text-sm text-gray-300">{new Date(event.event_date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                            <p className="text-sm">Duration: {event.durationMin} minutes</p>
                            <p className="text-sm">Type: {event.type}</p>
                            <button onClick={() => promptDeleteConfirmation(event)} className="mt-3 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm">Delete</button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
}