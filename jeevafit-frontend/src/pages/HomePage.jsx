// src/pages/HealthDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthData } from '../redux/healthSlice';
import HealthCard from '../components/HealthCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.health);

  useEffect(() => {
    dispatch(fetchHealthData());
  }, [dispatch]);

  const latest = data?.[0]; // latest health record

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Latest Health Vitals</h2>
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
    </div>
  );
};

export default HomePage;
