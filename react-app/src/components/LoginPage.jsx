import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { success, message } = await handleLogin(username, password);

      if (success) {
        setError('');
        setUsername('');
        setPassword('');
        navigate('/homepage'); // Redirect on successful login
      } else {
        setError(message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-teal-400 to-purple-500">
      <div className="border-4 border-gray-200 rounded-lg shadow-2xl p-10 bg-white max-w-md w-full transition-transform duration-300 transform hover:scale-105">
        <h2 className="mb-8 text-4xl font-extrabold text-center text-gray-800">
          Plan Your Next Event
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Your Password"
            className="border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className={`bg-teal-500 text-white py-3 rounded-lg w-full hover:bg-teal-600 transition duration-300 ease-in-out ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-500 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
