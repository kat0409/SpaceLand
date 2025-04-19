import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spaceland.onrender.com';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/get-events`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch events');
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                console.error("Invalid response format:", data);
                setEvents([]);
            }
        })
        .catch(err => {
            setError(err.message);
            setEvents([]);
        })
        .finally(() => setLoading(false));
    }, []);

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

            {loading ? (
            <p className="text-center">Loading events...</p>
            ) : Array.isArray(events) && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                <motion.div
                    key={event.eventID}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-800/50 rounded-lg overflow-hidden"
                >
                    <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{event.eventName}</h3>
                    <p className="text-sm text-gray-300 mb-2">
                        {new Date(event.event_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-300 mb-4">{event.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                        Duration: {event.durationMin} minutes
                        </span>
                        <span className="text-sm font-semibold">
                        Type: {event.type}
                        </span>
                    </div>
                    </div>
                </motion.div>
                ))}
            </div>
            ) : (
            <p className="text-center text-gray-400">No events found.</p>
            )}
        </div>
        <Footer />
        </div>
    );
}