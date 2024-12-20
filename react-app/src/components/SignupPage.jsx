import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    dateOfBirth: ''   // Added dateOfBirth
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/'); // Redirect on success
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
    }
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className='flex items-center justify-center h-screen w-full bg-gradient-to-br from-teal-400 to-purple-500'>
      <div className='border-4 border-gray-200 rounded-lg shadow-2xl p-10 bg-white max-w-md w-full transition-transform duration-300 transform hover:scale-105'>
        <h2 className='mb-8 text-4xl font-extrabold text-center text-gray-800'>Create Your Account</h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

        <form className='flex flex-col space-y-6' onSubmit={handleSubmit}>
          <div className='flex space-x-4 w-full'>
            <input
              type="text"
              name="firstName"
              placeholder='First Name'
              className='border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none'
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder='Last Name'
              className='border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none'
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder='Username'
            className='border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none'
            required
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder='Cell Phone'
            className='border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none'
            required
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder='Email'
            className='border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none'
            required
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder='Password'
            className='border border-gray-300 rounded-lg w-full px-4 py-3 transition duration-300 ease-in-out focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none'
            required
            value={formData.password}
            onChange={handleChange}
          />

       


          <button
            type="submit"
            className='bg-teal-500 text-white py-3 rounded-lg w-full hover:bg-teal-600 transition duration-300 ease-in-out'
          >
            Sign Up
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <Link to="/" className='text-teal-500 hover:underline'>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
