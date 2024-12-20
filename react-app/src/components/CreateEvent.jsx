// CreateEvent.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventBudget: '',
    eventPhone: '',
    eventLocation: '',
    plannerUsername: ''
  });

  const [venues, setVenues] = useState([]);
  const [planners, setPlanners] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch venues and planners on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const venueResponse = await fetch('http://127.0.0.1:5000/api/get_venues');
        const venueData = await venueResponse.json();
        if (venueResponse.ok) setVenues(venueData.venues || []);
        else setError('Failed to load venues');

        const plannerResponse = await fetch('http://127.0.0.1:5000/api/get_planners');
        const plannerData = await plannerResponse.json();
        if (plannerResponse.ok) setPlanners(plannerData.planners || []);
        else setError('Failed to load planners');
      } catch {
        setError('Server error. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Fetch phone number when planner is selected
  const handlePlannerChange = async (e) => {
    const selectedPlanner = e.target.value;

    if (!selectedPlanner) {
      setFormData({
        ...formData, 
        plannerUsername: '', 
        eventPhone: '' 
      });
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/get_planner_phone/${selectedPlanner}`);
      const data = await response.json();

      if (response.ok && data.phoneNumber) {
        setFormData({
          ...formData, 
          plannerUsername: selectedPlanner, 
          eventPhone: data.phoneNumber 
        });
        setError('');
      } else {
        setFormData({
          ...formData, 
          plannerUsername: selectedPlanner, 
          eventPhone: '' 
        });
        setError(data.error || 'Failed to load planner phone number');
      }
    } catch {
      setError('Server error. Please try again later.');
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/api/create_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/addservices?eventName=${formData.eventName}`); 
      } else {
        setError(data.error || 'Failed to create event.');
      }
    } catch (err) {
      console.error('Create Event Error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen w-full bg-gradient-to-br from-teal-400 to-purple-500'>
      <div className='border-4 border-gray-200 rounded-lg shadow-2xl p-10 bg-white max-w-md w-full'>
        <h2 className='mb-8 text-4xl font-extrabold text-center text-gray-800'>Create Event</h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

        <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
          <input 
            type="text" 
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Event Name" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="date" 
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="time" 
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="number" 
            name="eventBudget" 
            value={formData.eventBudget}
            onChange={handleChange}
            placeholder="Event Budget"  
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="text" 
            name="eventPhone"
            value={formData.eventPhone}
            placeholder="Phone Number (Auto-filled)" 
            readOnly
            className='border border-gray-300 rounded-lg w-full px-4 py-3 bg-gray-100'
          />

          <select 
            name="eventLocation" 
            value={formData.eventLocation}
            onChange={handleChange}
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required
          >
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue.venuename} value={venue.venuename}>{venue.venuename}</option>
            ))}
          </select>

          <select 
            name="plannerUsername" 
            value={formData.plannerUsername}
            onChange={handlePlannerChange}
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required
          >
            <option value="">Select Planner</option>
            {planners.map((planner) => (
              <option key={planner.username} value={planner.username}>{planner.username}</option>
            ))}
          </select>

          <button 
            type="submit" 
            className='bg-teal-500 text-white py-3 rounded-lg w-full hover:bg-teal-600 transition duration-300'
          >
            Create Event
          </button>
        </form>

        <div className='mt-6 text-center'>
          <Link 
            to="/homepage" 
            className='text-teal-500 font-semibold hover:underline'
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
