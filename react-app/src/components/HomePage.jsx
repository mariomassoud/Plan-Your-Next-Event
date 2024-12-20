// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventDetailsModal from '../components/EventDetailsModal';

const HomePage = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState(location.state?.message || '');
  const [error, setError] = useState('');

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/get_events');
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events || []);
        setMessage('');
        setError('');
      } else {
        setError(data.error || 'Failed to load events');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/get_all_services');
      const data = await response.json();
      if (response.ok) {
        setServices(data.services || []);
        setError('');
      } else {
        setError(data.error || 'Failed to load services');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleDelete = async (eventName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/delete_event/${eventName}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        await fetchEvents();
        await fetchServices();
      } else {
        setError(data.error || 'Failed to delete event');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    fetchServices();
  };

  const closeModal = async () => {
    await fetchEvents();
    await fetchServices();
    setSelectedEvent(null);
  };

  useEffect(() => {
    fetchEvents();
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Upcoming Events</h1>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {events.length === 0 && !error ? (
          <p className="text-center text-gray-600">No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.Eventname}
                className="relative bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div
                  onClick={() => handleEventClick(event)}
                  className="cursor-pointer"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{event.Eventname}</h2>
                  <p className="text-gray-600">📍 {event.venuename}</p>
                  <p className="text-gray-600">📅 {event.date}</p>
                </div>

                <button
                  onClick={() => handleDelete(event.Eventname)}
                  className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <EventDetailsModal
        event={selectedEvent}
        services={services}
        onClose={closeModal}
        fetchEvents={fetchEvents}
        fetchServices={fetchServices}
      />
    </div>
  );
};

export default HomePage;
