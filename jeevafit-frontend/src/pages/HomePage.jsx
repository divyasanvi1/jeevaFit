// src/pages/HealthDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthData } from "../redux/healthSlice";
import HealthCard from "../components/HealthCard";
import HeartRateChart from "../components/charts/HeartRateComponent";
import RespiratoryRateChart from "../components/charts/RespiratoryChart";
import HRVChart from "../components/charts/HrvChart";
import BloodPressureChart from "../components/charts/BpComponent";
import OxygenSaturationChart from "../components/charts/OxygenSaturation";
import UserDetailsCard from "../components/UserDetailCard";
import { useNavigate } from "react-router-dom";
import LowBatteryMode from "../components/FunctionalComponents/LowBatteryMode";
import io from "socket.io-client";
import { addNewHealthData } from "../redux/healthSlice";
import TrackingComponent from "../components/FunctionalComponents/Tracking";
import Modal from "../modal/Modal";
import VoiceCommandHandler from "../components/FunctionalComponents/VoiceCommandHandler";
import FatalAlertPopup from "../components/FatalAlertPopup"; // Add this
import PdfFileInput from "../components/FunctionalComponents/PdfUpload";
import BluetoothConnect from "../components/FunctionalComponents/BluetoothConnect";
import PredictRisk from "../components/FunctionalComponents/PredictRisk";
import { useTranslation } from "react-i18next";
import socket from "../utils/socket";
import UploadMedicalFileCompact from "../components/FunctionalComponents/UploadMedicalFileCompact";


const HomePage = () => {
  const [fatalAlert, setFatalAlert] = useState(null);
  const { t } = useTranslation();
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
  const userIdtwo = user?.id || user?._id;
  console.log("userId here", userIdtwo);

  console.log("fatal", fatalAlert);
  useEffect(() => {
    if (!userIdtwo) return;

    // Fetch initial health data
    dispatch(fetchHealthData());

    // Initialize socket inside the useEffect
    socket.connect();

    // Identify user to server
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      // Register the user with the server to join their personal room
      if (userIdtwo) {
        socket.emit("registerUser", userIdtwo);
      }
      socket.emit("identify", { userId: userIdtwo });
    });

    // Listen for real-time health updates
    socket.on("healthDataUpdated", ({ userId, data }) => {
      if (userId === userIdtwo) {
        console.log("New health data received via socket:", data);
        dispatch(addNewHealthData(data));
      }
    });
    // Listen for real-time Bluetooth vitals
socket.on("vitals-updated", (data) => {
  console.log("📡 [DASHBOARD] Received vitals via socket:", data);
  console.log("👤 Dashboard userId:", userIdtwo);
  console.log("🆔 Incoming userId:", data.userId);
  if (data.userId === userIdtwo) {
    console.log("📡 Vitals from Bluetooth received:", data);
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
      } else {
        console.log("Received alert for another user:", alertUserId);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [dispatch, user]);

  const latest = data?.[0]; // latest health record
  console.log("latest",latest);
  const handleToggleCard = () => {
    setShowUserCard((prev) => !prev); // Toggle visibility
  };

  // At the top of your component file
  const getHealthColor = (label, value) => {
    switch (label) {
      case "Heart Rate":
        if (value < 60) return "#60a5fa"; // low - blue
        if (value > 95) return "#f87171"; // high - red
        return "#34d399"; // normal - green
      case "SpO₂":
        if (value < 95) return "#60a5fa"; // low - red
        if (value > 100) return "#f87171"; 
        return "#34d399"; // normal - green
      case "Temperature":
        if (value < 36) return "#60a5fa";
        if (value > 38) return "#f87171";
        return "#34d399";
      case "Respiratory Rate":
        if (value < 12) return "#60a5fa";
        if (value > 18) return "#f87171";
        return "#34d399";
      case "Systolic BP":
        if (value < 90) return "#60a5fa";
        if (value > 130) return "#f87171";
        return "#34d399";
      case "Diastolic BP":
        if (value < 60) return "#60a5fa";
        if (value > 90) return "#f87171";
        return "#34d399";
      case "HRV":
        if (value < 0.03) return "#60a5fa";
        if (value > 0.2) return "#f87171";
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
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
  {t("healthdashboard.welcome", { name: user ? user.name : t("healthdashboard.guest") })}
  </h2>

  <div className="flex items-center justify-between mb-6">
    <button
      onClick={handleToggleCard}
      className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700"
    >
      {initials}
    </button>
    <LowBatteryMode />
  </div>

  {showUserCard && <UserDetailsCard user={user} onClose={handleToggleCard} />}

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  {/* Bluetooth Connect Panel */}
  <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span className="text-blue-600 text-2xl">🔗</span> {t("healthdashboard.bluetoothConnectTitle")}
    </h3>
    <BluetoothConnect userId={userIdtwo} />
  </div>

  {/* Emergency SOS Panel */}
  <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      🆘 {t("healthdashboard.emergencySosTitle")}
    </h3>
    <button
      onClick={() => setShowTracking(true)}
      className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition duration-200 "
    >
      🚨 {t("healthdashboard.startSosTracking")}
    </button>
    {showTracking && (
      <div className="mt-6">
        <TrackingComponent userId={userIdtwo} />
      </div>
    )}
  </div>

  {/* Voice Command Panel (conditionally rendered) */}
  {latest && (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🗣️ {t("healthdashboard.voiceCommandTitle")}
      </h3>
      <VoiceCommandHandler latest={latest} gender={user.gender}/>
    </div>
  )}

  {/* PDF Upload Panel */}
  <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      📄 {t("healthdashboard.uploadPdfTitle")}
    </h3>
    <PdfFileInput userId={userIdtwo} />
  </div>
  {/* Predict Risk Panel */}
  <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      🧠{t("healthdashboard.predictRiskTitle")}
    </h3>
    <PredictRisk userId={userIdtwo} />
  </div>
  <UploadMedicalFileCompact />
</div>

  <h2 className="text-2xl font-bold text-gray-800 mb-6">
    🩺 {t("healthdashboard.latestVitalsTitle")}
  </h2>

  <div className="flex flex-wrap gap-6">
    {latest &&
      [
        { label: "Heart Rate", value: latest.heartRate, maxValue: 100 },
        { label: "SpO₂", value: latest.oxygenSaturation },
        { label: "Temperature", value: latest.bodyTemperature, maxValue: 39 },
        {
          label: "Respiratory Rate",
          value: latest.respiratoryRate,
          maxValue: 60,
        },
        { label: "Systolic BP", value: latest.systolicBP, maxValue: 150 },
        { label: "Diastolic BP", value: latest.diastolicBP, maxValue: 100 },
        { label: "HRV", value: latest.derived_HRV, maxValue: 0.2 },
        { label: "BMI", value: latest.derived_BMI, maxValue: 50 },
        {
          label: "Pulse Pressure",
          value: latest.derived_Pulse_Pressure,
          maxValue: 100,
        },
        { label: "MAP", value: latest.derived_MAP, maxValue: 120 },
      ].map(({ label, value, maxValue }) => (
        <HealthCard
          key={label}
          value={value}
          label={t(`healthdashboard.vitals.${label}`)}
          color={getHealthColor(label, value)}
          maxValue={maxValue}
        />
      ))}
  </div>

  {fatalAlert && (
    <Modal>
      <h2 className="text-lg font-semibold text-red-700">{t("healthdashboard.fatalAlertTitle")}</h2>
      <p>{fatalAlert.reason}</p>
    </Modal>
  )}

  {/* Chart Section */}
  <div className="mt-12">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      📊 {t("healthdashboard.healthVitalsTrendsTitle")}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {t("healthdashboard.charts.heartRate")}
        </h3>
        <HeartRateChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {t("healthdashboard.charts.respiratoryRate")}
        </h3>
        <RespiratoryRateChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {t("healthdashboard.charts.hrv")}
        </h3>
        <HRVChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {t("healthdashboard.charts.bloodPressure")}
        </h3>
        <BloodPressureChart healthData={data} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {t("healthdashboard.charts.oxygenSaturation")}
        </h3>
        <OxygenSaturationChart healthData={data} />
      </div>
    </div>
  </div>
</div>

  );
};

export default HomePage;
