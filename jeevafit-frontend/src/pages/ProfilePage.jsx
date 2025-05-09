import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [latestVitals, setLatestVitals] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/userRoute/getUser/${userId}`);
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    const fetchLatestVitals = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/healthdataRoute/latest/${userId}`);
        setLatestVitals(res.data);
      } catch (err) {
        console.error("Failed to fetch vitals", err);
      }
    };

    fetchProfile();
    fetchLatestVitals();
  }, [userId]);

  if (!userData) return <p>Loading profile...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Age:</strong> {userData.age}</p>
        <p><strong>Gender:</strong> {userData.gender}</p>
        <p><strong>Height:</strong> {userData.height} m</p>
        <p><strong>Weight:</strong> {userData.weight} kg</p>
      </div>

      {latestVitals && (
        <div className="bg-blue-50 shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Latest Vitals</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Heart Rate:</strong> {latestVitals.heartRate ?? 'N/A'} bpm</p>
            <p><strong>SpO2:</strong> {latestVitals.oxygenSaturation ?? 'N/A'} %</p>
            <p><strong>Respiratory Rate:</strong> {latestVitals.respiratoryRate ?? 'N/A'} bpm</p>
            <p><strong>Body Temp:</strong> {latestVitals.bodyTemperature ?? 'N/A'} °C</p>
            <p><strong>Systolic BP:</strong> {latestVitals.systolicBP ?? 'N/A'} mmHg</p>
            <p><strong>Diastolic BP:</strong> {latestVitals.diastolicBP ?? 'N/A'} mmHg</p>
            <p><strong>HRV:</strong> {latestVitals.derived_HRV ?? 'N/A'}</p>
            <p><strong>BMI:</strong> {latestVitals.bmi ?? 'N/A'}</p>
          </div>
        </div>
      )}

      {!latestVitals && <p className="text-gray-500">Loading latest vitals...</p>}
    </div>
  );
};

export default ProfilePage;
