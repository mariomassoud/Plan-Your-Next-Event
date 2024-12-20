import React, { useState, useEffect } from 'react';

const SubscribePage = () => {
  const [events, setEvents] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/get_events');
      const data = await response.json();
      if (response.ok) setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/get_planners');
      const data = await response.json();
      if (response.ok) setUsers(data.planners || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Subscribe Event
  const handleSubscribe = async (eventName) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/subscribe_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, userName: selectedUser }),
      });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      console.error('Error subscribing to event:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Subscribe to Events</h1>

      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-bold">Subscribe As:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.username} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.Eventname} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{event.Eventname}</h2>
            <p className="text-gray-600">📅 {event.date}</p>
            <p className="text-gray-600">📍 {event.venuename}</p>

            <button
              onClick={() => handleSubscribe(event.Eventname)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribePage;
