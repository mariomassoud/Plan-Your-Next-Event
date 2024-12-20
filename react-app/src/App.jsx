import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import CreateEvent from './components/CreateEvent';
import EditEventModal from './components/EditEventModal';
import Venues from './components/Venues';
import CreateVenue from './components/CreateVenue';
import AddServices from './components/AddServices';
import SubscribePage from './components/SubscribePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Handle User Login
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      return { success: false, message: "Server error, try again later." };
    }
  };

  // Handle User Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/homepage"
          element={
            <PrivateRoute user={user}>
              <HomePage user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute user={user}>
              <CreateEvent user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:eventName"
          element={
            <PrivateRoute user={user}>
              <EditEventModal />
            </PrivateRoute>
          }
        />
        <Route
          path="/venues"
          element={
            <PrivateRoute user={user}>
              <Venues />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-venue"
          element={
            <PrivateRoute user={user}>
              <CreateVenue />
            </PrivateRoute>
          }
        />
        <Route
          path="/addservices"
          element={
            <PrivateRoute user={user}>
              <AddServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscribe"
          element={
            <PrivateRoute user={user}>
              <SubscribePage user={user} />
            </PrivateRoute>
          }
        />

        {/* Fallback for Unknown Routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
