// src/pages/HealthDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthData } from '../redux/healthSlice';
import HealthCard from '../components/HealthCard';
import HeartRateChart from '../components/HeartRateComponent';
import RespiratoryRateChart from '../components/RespiratoryChart';
import HRVChart from '../components/HrvChart';
import BloodPressureChart from '../components/BpComponent';
import OxygenSaturationChart from '../components/OxygenSaturation';
import UserDetailsCard from '../components/UserDetailCard';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.health);
  const user = useSelector((state) => state.auth.user); // assuming auth data stored here
  const [showProfile, setShowProfile] = useState(false);
  const initials = user ? user.name.split(' ').map((n) => n[0]).join('') : '';
  const [showUserCard, setShowUserCard] = useState(false);

  console.log('User Data:', user);
  console.log("User passed to UserDetailsCard:", user);

  useEffect(() => {
    dispatch(fetchHealthData());
  }, [dispatch]);

  const latest = data?.[0]; // latest health record
  const handleToggleCard = () => {
    setShowUserCard((prev) => !prev); // Toggle visibility
  };
  const goToNearestHospitals = () => {
    navigate("/nearest-hospitals");
  };
  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Welcome {user ? user.name : 'Guest'}</h2>
  {/* Latest Vitals Section */}
      <button
        onClick={handleToggleCard}
        className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
      >
         {initials}
      </button>

      {showUserCard && <UserDetailsCard user={user} onClose={handleToggleCard} />}
      <button
      onClick={goToNearestHospitals}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
    >
      Find Nearest Hospitals
    </button>

  <h2 className="text-2xl font-bold text-gray-800 mb-6">🩺 Latest Health Vitals</h2>

  <div className="flex flex-wrap gap-6 justify-start">
    {latest && (
      <>
        <HealthCard value={latest.heartRate} label="Heart Rate" color="#f87171" />
        <HealthCard value={latest.oxygenSaturation} label="SpO₂" color="#60a5fa" />
        <HealthCard value={latest.bodyTemperature} label="Temperature" color="#fbbf24" maxValue={45} />
        <HealthCard value={latest.respiratoryRate} label="Respiratory Rate" color="#34d399" />
        <HealthCard value={latest.systolicBP} label="Systolic BP" color="#a78bfa" maxValue={180} />
        <HealthCard value={latest.diastolicBP} label="Diastolic BP" color="#818cf8" maxValue={120} />
        <HealthCard value={latest.derived_HRV} label="HRV" color="#38bdf8" maxValue={100} />
        <HealthCard value={latest.derived_BMI} label="BMI" color="#f472b6" maxValue={50} />
        <HealthCard value={latest.derived_Pulse_Pressure} label="Pulse Pressure" color="#facc15" maxValue={100} />
        <HealthCard value={latest.derived_MAP} label="MAP" color="#4ade80" maxValue={120} />
      </>
    )}
  </div>

  {/* Chart Section */}
  <div className="mt-10">
    
    <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Health Vitals Trends</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Each chart wrapped in a card-like container */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Heart Rate Over Time</h3>
        <HeartRateChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Respiratory Rate Over Time</h3>
        <RespiratoryRateChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">HRV Over Time</h3>
        <HRVChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Blood Pressure (Sys & Dia)</h3>
        <BloodPressureChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Oxygen Saturation Over Time</h3>
        <OxygenSaturationChart healthData={data} />
      </div>
    </div>
  </div>
</div>

  );
};

export default HomePage;
