// AddServices.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AddServices = () => {
    const [form, setForm] = useState({
        serviceName: '',
        eventName: '',
        cost: '',
        contactInfo: '',
        details: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract eventName from query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const eventName = params.get('eventName');
        if (eventName) {
            setForm((prevForm) => ({ ...prevForm, eventName }));
        }
    }, [location.search]);

    // Handle form changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/add_service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Service added successfully');
                setForm({
                    ...form, 
                    serviceName: '', 
                    cost: '', 
                    contactInfo: '', 
                    details: '' 
                });
            } else {
                setError(data.error || 'Failed to add service.');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Add Service for {form.eventName}</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="serviceName"
                        placeholder="Service Name"
                        className="border border-gray-300 rounded-lg w-full px-4 py-3"
                        onChange={handleChange}
                        value={form.serviceName}
                        required
                    />

                    <input
                        type="number"
                        name="cost"
                        placeholder="Service Cost"
                        className="border border-gray-300 rounded-lg w-full px-4 py-3"
                        onChange={handleChange}
                        value={form.cost}
                        required
                    />

                    <input
                        type="text"
                        name="contactInfo"
                        placeholder="Contact Information"
                        className="border border-gray-300 rounded-lg w-full px-4 py-3"
                        onChange={handleChange}
                        value={form.contactInfo}
                        required
                    />

                    <textarea
                        name="details"
                        placeholder="Service Details (Optional)"
                        className="border border-gray-300 rounded-lg w-full px-4 py-3"
                        onChange={handleChange}
                        value={form.details}
                    ></textarea>

                    <div className="flex justify-between">
                        <button 
                            type="submit" 
                            className="bg-teal-500 text-white py-3 rounded-lg w-1/2 hover:bg-teal-600">
                            Add Another
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/homepage')} 
                            className="bg-gray-500 text-white py-3 rounded-lg w-1/2 hover:bg-gray-600">
                            Done
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServices;
