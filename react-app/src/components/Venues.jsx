// Venues.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');
  const [deletingVenue, setDeletingVenue] = useState(null);
  const navigate = useNavigate();

  // Fetch Venues from Backend
  const fetchVenues = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/fetch_venues');
      const data = await response.json();

      if (response.ok) {
        setVenues(data.venues || []);
        setError('');
      } else {
        setError(data.error || 'Failed to load venues');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  // Delete Venue Handler
  const handleDeleteVenue = async (venueName) => {
    setDeletingVenue(venueName); // Start deleting state
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/delete_venue/${venueName}`, {
        method: 'DELETE',
      });
      const data = await response.json();
  
      if (response.ok) {
        setVenues(venues.filter((venue) => venue.venuename !== venueName));
      } else {
        setError(data.error || 'Failed to delete venue');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setDeletingVenue(null); // Reset deleting state
    }
  };
  

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Venues List</h1>
          <button
            onClick={() => navigate('/create-venue')}
            className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
          >
            Create Venue
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {venues.length === 0 && !error ? (
          <p className="text-center text-gray-600">No venues available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <div
                key={venue.venuename}
                className={`bg-white p-6 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-50 ${deletingVenue === venue.venuename ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.venuename}</h3>
                <p className="text-gray-600">📍 Location: {venue.location}</p>
                <p className="text-gray-600">🏛 Capacity: {venue.capacity}</p>
                <p className="text-gray-600">💰 Rental Cost: {venue.rental_cost}</p>
                <p className="text-gray-600">📞 Phone: {venue.phone_number}</p>
                <p className="text-gray-600">🔧 Services: {venue.services_offered}</p>
                <p className="text-gray-600">📄 Description: {venue.place_description}</p>
                <button
                  onClick={() => handleDeleteVenue(venue.venuename)}
                  disabled={deletingVenue === venue.venuename}
                  className={`mt-4 px-4 py-2 rounded text-white transition-colors ${deletingVenue === venue.venuename ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {deletingVenue === venue.venuename ? 'Deleting...' : 'Delete Venue'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;
