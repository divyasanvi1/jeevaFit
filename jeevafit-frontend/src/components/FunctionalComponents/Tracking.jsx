// src/components/TrackingComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from '../../utils/axios';
import { useTranslation } from 'react-i18next';

const TrackingComponent = ({ userId }) => {
  const { t } = useTranslation();
  const [trackingStarted, setTrackingStarted] = useState(false);
  const [distanceMoved, setDistanceMoved] = useState(null);
  const [threshold, setThreshold] = useState(500);
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
      await axios.post('/api/tracking/start', { userId, location, thresholdDistance: Number(threshold), });
      setTrackingStarted(true);
      localStorage.setItem('tracking_started', 'true');
      localStorage.setItem('tracking_threshold', threshold);
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
        const response = await axios.post('/api/tracking/update', {
          userId,
          currentLocation,
        });
        setDistanceMoved(response.data.distance.toFixed(2));
        if (response.data.message.includes('beyond') ) {
          alert('🚨  You moved beyond the safe zone.');
          stopLocationUpdates();
        }
        // 🚨 Check 2: email was sent
      if (response.data.emailSentAt) {
        alert('🚨 Emergency Email Sent! You moved beyond the safe zone.');
        stopLocationUpdates();
      }
      } catch (err) {
        console.error(err);
      }
    }, 10000); // Every 10 seconds
  };
  const stopTracking = async () => {
    try {
      await axios.post('/api/tracking/stop', { userId });
    } catch (error) {
      console.error('Error stopping tracking:', error);
    } finally {
      clearInterval(intervalRef.current);
      setTrackingStarted(false);
      setDistanceMoved(null);
      localStorage.removeItem('tracking_started');
      localStorage.removeItem('tracking_threshold');
      alert(t('tracking.stoppedAlert'));
    }
  };
  
  const stopLocationUpdates = () => {
    clearInterval(intervalRef.current);
    setTrackingStarted(false);
    localStorage.removeItem('tracking_started');
localStorage.removeItem('tracking_threshold');

  };

  useEffect(() => {
    // Resume tracking if it was active before refresh
    console.log("👤 userId on mount:", userId);
    const resumeTracking = async () => {
      const savedTracking = localStorage.getItem('tracking_started');
      const savedThreshold = localStorage.getItem('tracking_threshold');
      console.log("💾 savedTracking:", savedTracking); // DEBUG
      console.log("💾 savedThreshold:", savedThreshold); // DEBUG
  
      if (savedTracking === 'true') {
        if (savedThreshold) setThreshold(savedThreshold);
  
        try {
          const res = await axios.get(`/api/tracking/status?userId=${userId}`);
          console.log("📡 Tracking status response:", res.data); // DEBUG
          if (res.data.active) {
            setTrackingStarted(true);
            startLocationUpdates(); // resume interval only if backend confirms active
          } else {
            localStorage.removeItem('tracking_started');
            localStorage.removeItem('tracking_threshold');
          }
        } catch (err) {
          console.error('Failed to check tracking status:', err);
        }
      }
    };
  
    resumeTracking();
    return () => stopLocationUpdates();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">{t('tracking.title')}</h2>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">{t('tracking.thresholdLabel')}</label>
        <input
          type="number"
          min="50"
          max="5000"
          className="w-full p-2 border border-gray-300 rounded"
          value={threshold}
          disabled={trackingStarted}
          onChange={(e) => setThreshold(e.target.value)}
        />
        <p className="text-sm text-gray-500">{t('tracking.thresholdHint')}</p>
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={startTracking}
        disabled={trackingStarted}
      >
        {trackingStarted ? t('tracking.button.active') : t('tracking.button.start')}
      </button>
      {trackingStarted && (
  <button
    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    onClick={stopTracking}
  >
    {t('tracking.button.stop')}
  </button>
)}

      {distanceMoved && (
        <p className="mt-4 text-gray-700">{t('tracking.distance', { distance: distanceMoved })}</p>
      )}
    </div>
  );
};

export default TrackingComponent;
