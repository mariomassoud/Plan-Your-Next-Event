// src/components/EditEventModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditEventModal = ({ event, onClose }) => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    eventName: event.Eventname || '',
    eventDate: event.date || '',
    eventTime: event.time || '',
    eventBudget: event.EventBudget || '',
    eventPhone: event.phoneNumber || '',
    venuename: event.venuename || '',
    plannerUsername: event.plannerusername || '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/get_venues');
        const data = await response.json();
        if (response.ok) {
          setVenues(data.venues || []);
        } else {
          setError(data.error || 'Failed to load venues.');
        }
      } catch (err) {
        setError('Server error while fetching venues.');
      }
    };
    fetchVenues();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/update_event/${formData.eventName}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate('/homepage', { state: { message: data.message } });
        onClose(); // Close after success
      } else {
        setError(data.error || 'Failed to update event.');
      }
    } catch (error) {
      setError('Server error while updating the event.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Event</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Event Name</span>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Event Date</span>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Event Time</span>
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Event Budget</span>
            <input
              type="number"
              name="eventBudget"
              value={formData.eventBudget}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Phone Number</span>
            <input
              type="tel"
              name="eventPhone"
              value={formData.eventPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Venue</span>
            <select
              name="venuename"
              value={formData.venuename}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.venuename} value={venue.venuename}>
                  {venue.venuename}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Planner</span>
            <input
              type="text"
              name="plannerUsername"
              value={formData.plannerUsername}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </label>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
