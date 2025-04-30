// src/pages/HealthDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthData } from "../redux/healthSlice";
import HealthCard from "../components/HealthCard";
import HeartRateChart from "../components/HeartRateComponent";
import RespiratoryRateChart from "../components/RespiratoryChart";
import HRVChart from "../components/HrvChart";
import BloodPressureChart from "../components/BpComponent";
import OxygenSaturationChart from "../components/OxygenSaturation";
import UserDetailsCard from "../components/UserDetailCard";
import { useNavigate } from "react-router-dom";
import LowBatteryMode from "../components/LowBatteryMode";
import io from "socket.io-client";
import { addNewHealthData } from "../redux/healthSlice";
import TrackingComponent from "../components/Tracking";
import Modal from "../modal/Modal";
import VoiceCommandHandler from "../components/VoiceCommandHandler";
import FatalAlertPopup from "../components/FatalAlertPopup"; // Add this
import PdfFileInput from "../components/PdfUpload";
import BluetoothConnect from '../components/BluetoothConnect';

const HomePage = () => {
  const [fatalAlert, setFatalAlert] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.health);
  const user = useSelector((state) => state.auth.user); // assuming auth data stored here
  const [showProfile, setShowProfile] = useState(false);
  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";
  const [showUserCard, setShowUserCard] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  console.log("User Data:", user);
  console.log("User passed to UserDetailsCard:", user);
  const userIdtwo = user?.id ||user?._id;
  console.log("userId here",userIdtwo);
  

  console.log("fatal",fatalAlert);
  useEffect(() => {
    if (!userIdtwo) return;

    // Fetch initial health data
    dispatch(fetchHealthData());

    // Initialize socket inside the useEffect
    const socket = io("http://localhost:8001", {
      withCredentials: true,
    });

    // Identify user to server
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      // Register the user with the server to join their personal room
  if (userIdtwo) {
    socket.emit("registerUser", userIdtwo);
  }
      socket.emit("identify", { userId: userIdtwo});
    });

    // Listen for real-time health updates
    socket.on("healthDataUpdated", ({ userId, data }) => {
      if (userId === userIdtwo) {
        console.log("New health data received via socket:", data);
        dispatch(addNewHealthData(data));
      }
    });
    // Inside your existing useEffect
    socket.on("fatalHealthAlert", ({ userId: alertUserId, values, reason }) => {
      console.log("fatalHealthAlert received:", { userIdtwo, values, reason });
      if (alertUserId === userIdtwo) {
        console.warn("🚨 FATAL HEALTH ALERT:", values);
        setFatalAlert({ values, reason });

        // Optional auto-dismiss
        setTimeout(() => setFatalAlert(null), 15000);
      }else {
        console.log("Received alert for another user:", alertUserId);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch, user]);

  const latest = data?.[0]; // latest health record
  const handleToggleCard = () => {
    setShowUserCard((prev) => !prev); // Toggle visibility
  };

  // At the top of your component file
const getHealthColor = (label, value) => {
  switch (label) {
    case "Heart Rate":
      if (value < 60) return "#60a5fa"; // low - blue
      if (value > 100) return "#f87171"; // high - red
      return "#34d399"; // normal - green
    case "SpO₂":
      if (value < 90) return "#f87171"; // low - red
      if (value < 95) return "#fbbf24"; // medium - yellow
      return "#34d399"; // normal - green
    case "Temperature":
      if (value < 36) return "#60a5fa";
      if (value > 38) return "#f87171";
      return "#34d399";
    case "Respiratory Rate":
      if (value < 12) return "#60a5fa";
      if (value > 20) return "#f87171";
      return "#34d399";
    case "Systolic BP":
      if (value < 90) return "#60a5fa";
      if (value > 140) return "#f87171";
      return "#34d399";
    case "Diastolic BP":
      if (value < 60) return "#60a5fa";
      if (value > 90) return "#f87171";
      return "#34d399";
    case "HRV":
      if (value < 20) return "#f87171";
      if (value > 100) return "#fbbf24";
      return "#34d399";
    case "BMI":
      if (value < 18.5) return "#60a5fa";
      if (value > 25) return "#f87171";
      return "#34d399";
    case "Pulse Pressure":
      if (value < 30) return "#60a5fa";
      if (value > 60) return "#f87171";
      return "#34d399";
    case "MAP":
      if (value < 70) return "#60a5fa";
      if (value > 110) return "#f87171";
      return "#34d399";
    default:
      return "#d1d5db"; // gray fallback
  }
};

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">
        Welcome {user ? user.name : "Guest"}
      </h2>
      {/* Latest Vitals Section */}

      <button
        onClick={handleToggleCard}
        className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
      >
        {initials}
      </button>
      <LowBatteryMode />
      {showUserCard && (
        <UserDetailsCard user={user} onClose={handleToggleCard} />
      )}
       
       <BluetoothConnect userId={userIdtwo} />
     
      <div>
        <button
          onClick={() => setShowTracking(true)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🚨 Start SOS Tracking
        </button>

        {showTracking && <TrackingComponent userId={userIdtwo} />}
      </div>
      {latest && (
  <>
  
    <div className="p-4 bg-white rounded-xl shadow-lg mt-8 w-fit">
  <VoiceCommandHandler latest={latest} />
</div>

  </>
)}
<PdfFileInput userId={userIdtwo} />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🩺 Latest Health Vitals
      </h2>

      <div className="flex flex-wrap gap-6 justify-start">
      {latest && (
  <>
    {[
      { label: "Heart Rate", value: latest.heartRate , maxValue: 220},
      { label: "SpO₂", value: latest.oxygenSaturation },
      { label: "Temperature", value: latest.bodyTemperature, maxValue: 45 },
      { label: "Respiratory Rate", value: latest.respiratoryRate,maxValue: 60 },
      { label: "Systolic BP", value: latest.systolicBP, maxValue: 180 },
      { label: "Diastolic BP", value: latest.diastolicBP, maxValue: 120 },
      { label: "HRV", value: latest.derived_HRV, maxValue: 100 },
      { label: "BMI", value: latest.derived_BMI, maxValue: 50 },
      { label: "Pulse Pressure", value: latest.derived_Pulse_Pressure, maxValue: 100 },
      { label: "MAP", value: latest.derived_MAP, maxValue: 120 },
    ].map(({ label, value, maxValue }) => (
      <HealthCard
        key={label}
        value={value}
        label={label}
        color={getHealthColor(label, value)}
        maxValue={maxValue}
      />
    ))}
  </>
)}
      </div>
      {fatalAlert && (
  <Modal>
    <h2>Fatal Alert</h2>
    <p>{fatalAlert.reason}</p>
    {/* Display the values */}
  </Modal>
)}


      {/* Chart Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📊 Health Vitals Trends
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Each chart wrapped in a card-like container */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Heart Rate Over Time
            </h3>
            <HeartRateChart healthData={data} />
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Respiratory Rate Over Time
            </h3>
            <RespiratoryRateChart healthData={data} />
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              HRV Over Time
            </h3>
            <HRVChart healthData={data} />
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Blood Pressure (Sys & Dia)
            </h3>
            <BloodPressureChart healthData={data} />
          </div>

          <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Oxygen Saturation Over Time
            </h3>
            <OxygenSaturationChart healthData={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
