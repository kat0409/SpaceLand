import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function EventsForSupervisor() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const handleDeleteEvent = async (eventID, eventName) => {
        try {
            const res = await fetch(`${BACKEND_URL}/supervisor/HR/delete-event$eventID=${eventID}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete event");
            fetchEvents();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="text-white">
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
                            <button onClick={() => handleDeleteEvent(event.eventID, event.eventName)} className="mt-3 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm">Delete</button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
}
