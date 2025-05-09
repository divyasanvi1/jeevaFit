// BookingForm.jsx
// src/components/BookingForm.jsx
import React, { useState } from "react";
import axios from "axios";

const BookingForm = ({ hospital }) => {
  const [patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");

  if (!hospital) return null; // prevents crash

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const res = await axios.post("http://localhost:8001/booking/create", {
        hospitalName: hospital.name,
        patientName,
        reason,
      });
      setBookingStatus("Appointment booked successfully!");
    } catch (err) {
      console.error(err);
      setBookingStatus("Booking failed");
    }
  };

  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">{hospital?.name}</h2>
      <p className="text-sm text-gray-600">{hospital?.vicinity}</p>
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Book Appointment
        </button>
      </form>
      {bookingStatus && <p className="text-green-600 mt-2">{bookingStatus}</p>}
    </div>
  );
};

export default BookingForm;
