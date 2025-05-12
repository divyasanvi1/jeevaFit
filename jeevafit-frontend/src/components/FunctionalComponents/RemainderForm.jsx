// src/components/ReminderForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ReminderForm = ({ userId, userEmail }) => {
  const [reason, setReason] = useState('');
  const [time, setTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !time || !startDate || !endDate) {
      return setMessage("Please fill in all fields.");
    }

    try {
      const response = await axios.post('http://localhost:8001/reminder/create', {
        userId,
        reason,
        time,
        startDate,
        endDate,
        email: userEmail,
      });

      setMessage(response.data.message || "Reminder scheduled!");
      setReason('');
      setTime('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error(error);
      setMessage("Failed to schedule reminder.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Schedule a Medical Reminder</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Reminder Reason</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Take blood pressure medicine"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Reminder Time</label>
          <input
            type="time"
            className="w-full border rounded p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Schedule Reminder
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default ReminderForm;
