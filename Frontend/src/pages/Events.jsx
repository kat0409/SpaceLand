import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://spacelandmark.onrender.com';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '' });
  const [editEventId, setEditEventId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});
  const role = localStorage.getItem('role');
  const department = localStorage.getItem('department');
  const isHRSupervisor = role === 'supervisor' && department?.toLowerCase() === 'management';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching events from:', `${BACKEND_URL}/get-events`);
        
        const response = await fetch(`${BACKEND_URL}/get-events`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Events data:', data);
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Showing demo content instead.');
        
        // Set demo events as fallback
        setEvents([
          {
            eventID: 1,
            eventName: 'Starlight Festival',
            event_date: '2025-07-15',
            description: 'Enjoy a colorful festival full of light that will make the night sky shine with beauty.',
            durationMin: 180,
            type: 'Festival'
          },
          {
            eventID: 2,
            eventName: 'Space Race Marathon',
            event_date: '2025-08-20',
            description: 'A tribute to the engineers that worked so hard in the space race. Join us for this amazing marathon.',
            durationMin: 300,
            type: 'Marathon'
          },
          {
            eventID: 3,
            eventName: 'Alien Encounter Night',
            event_date: '2025-09-10',
            description: 'Watch our friends from other galaxies parade in our park with amazing costumes and performances.',
            durationMin: 120,
            type: 'Parade'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/supervisor/HR/add-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: newEvent.name,
          event_date: newEvent.date,
          description: newEvent.description,
          durationMin: 60, // Default duration
          type: 'Festival' // Default type
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      setNewEvent({ name: '', date: '', description: '' });
      const updatedEvents = await fetch(`${BACKEND_URL}/get-events`).then(res => res.json());
      setEvents(updatedEvents);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/supervisor/HR/delete-event?eventID=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      const updatedEvents = await fetch(`${BACKEND_URL}/get-events`).then(res => res.json());
      setEvents(updatedEvents);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  const handleEditEvent = async () => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/supervisor/HR/update-event`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventID: editedEvent.id,
          eventName: editedEvent.name,
          event_date: editedEvent.date,
          description: editedEvent.description,
          durationMin: editedEvent.durationMin || 60,
          type: editedEvent.type || 'Festival'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      setEditEventId(null);
      setEditedEvent({});
      const updatedEvents = await fetch(`${BACKEND_URL}/get-events`).then(res => res.json());
      setEvents(updatedEvents);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    }
  };

  // Helper function to get event image based on event type
  const getEventImage = (type, name) => {
    if (name?.toLowerCase().includes('alien') || type?.toLowerCase().includes('alien')) {
      return '/assets/alien-night.jpg';
    } else if (name?.toLowerCase().includes('star') || type?.toLowerCase().includes('festival')) {
      return '/assets/starlight-festival.jpg';
    } else if (name?.toLowerCase().includes('race') || type?.toLowerCase().includes('marathon')) {
      return '/assets/space-race.jpg';
    } else {
      return '/assets/space-bg.jpg';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">🎉 Upcoming Events</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            {error}
            <details className="mt-2 text-sm opacity-80">
              <summary>Debug Info</summary>
              <p>Backend URL: {BACKEND_URL}</p>
              <p>Role: {role || 'Not logged in'}</p>
              <p>Department: {department || 'N/A'}</p>
              <button 
                onClick={() => window.open(`${BACKEND_URL}/get-events`, '_blank')}
                className="mt-2 text-xs bg-blue-500/30 px-2 py-1 rounded"
              >
                Test API Endpoint
              </button>
            </details>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {isHRSupervisor && (
              <div className="mb-8 space-y-4">
                <h2 className="text-2xl font-semibold">➕ Add New Event</h2>
                <input
                  type="text"
                  placeholder="Event Name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  className="block w-full bg-white/10 p-2 rounded"
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="block w-full bg-white/10 p-2 rounded"
                />
                <textarea
                  placeholder="Event Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="block w-full bg-white/10 p-2 rounded"
                />
                <button
                  onClick={handleAddEvent}
                  className="bg-green-500 px-4 py-2 rounded mt-2"
                >
                  Add Event
                </button>
              </div>
            )}

            <div className="space-y-6">
              {Array.isArray(events) && events.length > 0 ? events.map(event => (
                <div key={event?.eventID || Math.random()} className="bg-white/10 rounded-xl p-4">
                  {editEventId === event?.eventID ? (
                    <>
                      <input
                        value={editedEvent.name}
                        onChange={(e) => setEditedEvent({ ...editedEvent, name: e.target.value })}
                        className="block w-full bg-white/10 p-2 rounded mb-2"
                      />
                      <input
                        type="date"
                        value={editedEvent.date}
                        onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                        className="block w-full bg-white/10 p-2 rounded mb-2"
                      />
                      <textarea
                        value={editedEvent.description}
                        onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                        className="block w-full bg-white/10 p-2 rounded mb-2"
                      />
                      <button onClick={handleEditEvent} className="bg-blue-500 px-4 py-1 rounded mr-2">Save</button>
                      <button onClick={() => setEditEventId(null)} className="bg-gray-500 px-4 py-1 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                          <img 
                            src={getEventImage(event?.type, event?.eventName)} 
                            alt={event?.eventName || 'Event'} 
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/space-bg.jpg';
                            }}
                          />
                        </div>
                        <div className="md:w-2/3">
                          <h3 className="text-xl font-bold">{event?.eventName || 'Unnamed Event'}</h3>
                          <p className="text-sm text-gray-300">📅 {event?.event_date ? new Date(event.event_date).toLocaleDateString() : 'Date TBD'}</p>
                          <p className="mt-2">{event?.description || 'No description available'}</p>
                          <p className="text-sm text-gray-300 mt-1">⏱️ Duration: {event?.durationMin || 0} minutes | 🏷️ Type: {event?.type || 'Unknown'}</p>
                          {isHRSupervisor && (
                            <div className="mt-3 space-x-2">
                              <button
                                onClick={() => {
                                  setEditEventId(event.eventID);
                                  setEditedEvent({
                                    id: event.eventID,
                                    name: event.eventName,
                                    date: event.event_date,
                                    description: event.description,
                                    durationMin: event.durationMin,
                                    type: event.type
                                  });
                                }}
                                className="bg-yellow-500 px-3 py-1 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.eventID)}
                                className="bg-red-500 px-3 py-1 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-xl">No events scheduled at this time.</p>
                  <p>Check back later for upcoming events!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}