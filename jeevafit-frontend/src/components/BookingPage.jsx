import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BookingPage = () => {
  const location = useLocation();
  const { hospital } = location.state || {};

  const [patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");

  if (!hospital) return <p>No hospital selected for booking.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8001/booking/create", {
        hospitalName: hospital.name,
        hospitalPlaceId: hospital.place_id,
        reason,
        patientName,
        date: new Date().toISOString(), // for now
        timeSlot: "10:00 AM", // sample
        doctorName: "Dr. Default", // mock for now
        userId: "user_id_here", // ideally fetched from auth
      });
      setBookingStatus("Appointment booked successfully!");
    } catch (err) {
      console.error(err);
      setBookingStatus("Booking failed.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-2">{hospital.name}</h2>
      <p className="text-gray-600 mb-4">{hospital.address}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Reason for Visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Book Appointment
        </button>
      </form>

      {bookingStatus && <p className="mt-4 text-green-600">{bookingStatus}</p>}
    </div>
  );
};

export default BookingPage;
