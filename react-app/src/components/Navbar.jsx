import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  // Handle Subscribe Navigation
  const handleSubscribeClick = () => navigate('/subscribe');

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-br from-teal-400 to-purple-500 shadow-lg">
      <Link to="/" className="text-white text-2xl font-bold">
        Event Planner
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/homepage" className="text-white font-semibold hover:underline">Home</Link>
        <Link to="/create" className="text-white font-semibold hover:underline">Create Event</Link>
        <Link to="/venues" className="text-white font-semibold hover:underline">Venues</Link>

        <button
          onClick={handleSubscribeClick}
          className="text-white font-semibold hover:underline"
        >
          Subscribe
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
            className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Signout
          </button>
        ) : (
          <Link
            to="/login"
            className="text-white font-semibold bg-teal-500 px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
          >
            Signout
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
