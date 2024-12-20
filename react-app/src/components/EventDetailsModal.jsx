// src/components/EventDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import EditEventModal from './EditEventModal';

const EventDetailsModal = ({ event, services, onClose, fetchEvents, fetchServices }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);

  // Refresh event details on event change
  useEffect(() => {
    setCurrentEvent(event);
  }, [event]);

  // Fetch updated event from backend
  const fetchUpdatedEvent = async (eventName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/edit_event_details/${eventName}`);
      const data = await response.json();
      if (response.ok) {
        setCurrentEvent(data.event); // Update event details
      } else {
        console.error("Failed to fetch updated event details:", data.error);
      }
    } catch (error) {
      console.error("Server error while fetching updated event:", error);
    }
  };

  // Find related services
  const relevantServices = services.filter(
    (service) => service.eventName === currentEvent?.Eventname
  );

  const handleEditClick = () => setShowEditModal(true);

  const closeEditModal = async () => {
    setShowEditModal(false);
    await fetchEvents();      // Refresh homepage events
    await fetchServices();    // Refresh services list
    await fetchUpdatedEvent(currentEvent.Eventname); // Update current event details
  };

  if (!currentEvent) return null;

  return (
    <>
      {/* Event Details Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
          >
            Edit
          </button>

          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
            {currentEvent.Eventname}
          </h2>

          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">📅 Date:</span> {currentEvent.date}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">⏰ Time:</span> {currentEvent.time}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">💸 Budget:</span> {currentEvent.EventBudget}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">📞 Contact:</span> {currentEvent.phoneNumber}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">📍 Location:</span> {currentEvent.venuename}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">👤 Planner:</span> {currentEvent.plannerusername}
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            Provided Services
          </h3>

          {relevantServices.length > 0 ? (
            <ul className="space-y-4">
              {relevantServices.map((service, index) => (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <h4 className="text-xl font-bold text-gray-800 mb-1">
                    {service.serviceName}
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">💵 Cost:</span> ${service.cost}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">📞 Contact:</span> {service.contactInfo}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">📋 Details:</span> {service.details}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No services available.</p>
          )}

          <button
            onClick={onClose}
            className="mt-6 bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <EditEventModal
            event={currentEvent}
            onClose={closeEditModal}
            fetchEvents={fetchEvents}
          />
        </div>
      )}
    </>
  );
};

export default EventDetailsModal;
