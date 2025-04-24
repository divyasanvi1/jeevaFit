// src/components/TrackingComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const TrackingComponent = ({ userId }) => {
  const [trackingStarted, setTrackingStarted] = useState(false);
  const [distanceMoved, setDistanceMoved] = useState(null);
  const intervalRef = useRef(null);

  const getCurrentLocation = () =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        reject
      )
    );

  const startTracking = async () => {
    const location = await getCurrentLocation();
    try {
      await axios.post('http://localhost:8001/api/tracking/start', { userId, location });
      setTrackingStarted(true);
      startLocationUpdates();
    } catch (error) {
      alert('Failed to start tracking.');
      console.error(error);
    }
  };

  const startLocationUpdates = () => {
    intervalRef.current = setInterval(async () => {
      const currentLocation = await getCurrentLocation();
      try {
        const response = await axios.post('http://localhost:8001/api/tracking/update', {
          userId,
          currentLocation,
        });
        setDistanceMoved(response.data.distance.toFixed(2));
        if (response.data.message.includes('beyond')) {
          alert('🚨 Alert sent: You moved beyond the safe zone.');
          stopLocationUpdates();
        }
      } catch (err) {
        console.error(err);
      }
    }, 10000); // Every 10 seconds
  };

  const stopLocationUpdates = () => {
    clearInterval(intervalRef.current);
    setTrackingStarted(false);
  };

  useEffect(() => {
    return () => stopLocationUpdates();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">SOS Tracking</h2>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={startTracking}
        disabled={trackingStarted}
      >
        {trackingStarted ? 'Tracking Active...' : 'Start Tracking'}
      </button>
      {distanceMoved && (
        <p className="mt-4 text-gray-700">Distance from safe zone: {distanceMoved} meters</p>
      )}
    </div>
  );
};

export default TrackingComponent;
