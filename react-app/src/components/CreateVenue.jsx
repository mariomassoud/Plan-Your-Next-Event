// CreateVenue.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateVenue = () => {
  const [formData, setFormData] = useState({
    venuename: '',
    location: '',
    capacity: '',
    rental_cost: '',
    phone_number: '',
    services_offered: '',
    place_description: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/api/create_venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/venues');
      } else {
        setError(data.error || 'Venue creation failed. Please try again.');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen w-full bg-gradient-to-br from-teal-400 to-purple-500'>
      <div className='border-4 border-gray-200 rounded-lg shadow-2xl p-10 bg-white max-w-md w-full'>
        <h2 className='mb-8 text-4xl font-extrabold text-center text-gray-800'>Create Venue</h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

        <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
          <input 
            type="text" 
            name="venuename"
            value={formData.venuename}
            onChange={handleChange}
            placeholder="Venue Name" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="number" 
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="number" 
            name="rental_cost"
            value={formData.rental_cost}
            onChange={handleChange}
            placeholder="Rental Cost" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="text" 
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <input 
            type="text" 
            name="services_offered"
            value={formData.services_offered}
            onChange={handleChange}
            placeholder="Services Offered" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          />

          <textarea 
            name="place_description"
            value={formData.place_description}
            onChange={handleChange}
            placeholder="Place Description" 
            className='border border-gray-300 rounded-lg w-full px-4 py-3'
            required 
          ></textarea>

          <button 
            type="submit" 
            className='bg-teal-500 text-white py-3 rounded-lg w-full hover:bg-teal-600 transition duration-300'
          >
            Create Venue
          </button>
        </form>

        <div className='mt-6 text-center'>
          <button 
            onClick={() => navigate('/venues')} 
            className='text-teal-500 font-semibold hover:underline'
          >
            &larr; Back to Venues
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateVenue;
