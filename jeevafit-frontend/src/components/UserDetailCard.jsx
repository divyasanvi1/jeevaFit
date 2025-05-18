// src/components/UserDetailsCard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../redux/userSlice";
import axios from "../utils/axios";
import generatePDF from "../utils/generatePdf";
import ReminderForm from "./FunctionalComponents/RemainderForm";
import HealthProfileQR from "./FunctionalComponents/HealthProfileQR";
import Modal from "../modal/Modal";
import WeatherPage from "../pages/WeatherPage"; // adjust relative path if needed
import healthSlice from "../redux/healthSlice";
import { useTranslation } from "react-i18next";


const UserDetailsCard = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [fullUser, setFullUser] = useState(null);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showWeather, setShowWeather] = useState(false);

  const [sosStatus, setSosStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const healthData = useSelector((state) => state.health);
  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    age: storedUser?.age || "",
    weight: storedUser?.weight || "",
    gender: storedUser?.gender || "",
    height: storedUser?.height || "",
  });
  const handleGeneratePDF = () => {
    generatePDF({ userData: formData, healthData });
  };
  useEffect(() => {
    const fetchFullUserDetails = async () => {
      try {
        const res = await axios.post(
          "/userRoute/details",
          { email: storedUser.email }
        );
        setFullUser(res.data.user);
        setFormData(res.data.user);
        console.log("Fetched user details:", res.data.user);
        dispatch(updateUserDetails(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.error("Error fetching full user data:", err);
      }
    };

    fetchFullUserDetails();
  }, [storedUser.email, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        "/userRoute/update",
        formData
      );
      const updatedUser = response.data.user;
      setFormData(updatedUser);
      setFullUser(updatedUser);
      dispatch(updateUserDetails(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating user data:", err);
    }
  };

  const handleSendSOS = () => {
    if (!navigator.geolocation) {
      setSosStatus("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await axios.post("/api/sos", {
            userId: formData._id,
            location: { lat: latitude, lng: longitude },
          });

          setSosStatus(res.data.message);
        } catch (err) {
          setSosStatus(err.response?.data?.error || "Failed to send SOS alert");
        }
      },
      () => {
        setSosStatus("Failed to get location");
      }
    );
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 z-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-red-500 float-right text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4">{t('userProfile.title')}</h2>
      <div className="space-y-2">
      <p><strong>{t('userProfile.name')}:</strong> {formData.name}</p>
      <p><strong>{t('userProfile.email')}:</strong> {formData.email}</p>
        {isEditing ? (
          <>
            {["gender", "age", "weight", "height"].map((field) => (
              <div key={field}>
                <label className="block capitalize">{t(`userProfile.${field}`)}:</label>
                <input
                  type={field === "gender" ? "text" : "number"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="border p-1 w-full"
                />
              </div>
            ))}
            <button
              onClick={handleUpdate}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
             {t('userProfile.saveChanges')}
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>{t('userProfile.gender')}:</strong> {formData.gender}
            </p>
            <p>
              <strong>{t('userProfile.age')}:</strong> {formData.age}
            </p>
            <p>
              <strong>{t('userProfile.weight')}:</strong> {formData.weight} kg
            </p>
            <p>
              <strong>{t('userProfile.height')}:</strong> {formData.height} m
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
             {t('userProfile.edit')}
            </button>
          </>
        )}
      </div>
      <button
        onClick={handleGeneratePDF}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {t('userProfile.downloadPdf')}
      </button>
      <button
        onClick={() => setShowReminderForm(true)}
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
      >
        {t('userProfile.setReminder')}
      </button>
      {showReminderForm && (
        <div className="mt-4">
          <ReminderForm userId={formData._id} userEmail={formData.email} />
          <button
            onClick={() => setShowReminderForm(false)}
            className="mt-2 text-sm text-red-500 underline"
          >
            {t('userProfile.cancelReminder')}
          </button>
        </div>
      )}
      <button
        onClick={() => (window.location.href = "/booking")}
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
      >
        {t('userProfile.bookAppointment')}
      </button>
      <button
        onClick={() => setShowSOSModal(true)}
        className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
      >
        🚨 {t('userProfile.sendSOS')}
      </button>
      <HealthProfileQR userId={formData._id} />
      {showSOSModal && (
        <Modal onClose={() => setShowSOSModal(false)}>
          <h3 className="text-lg font-semibold">{t('userProfile.sosConfirm')}</h3>
          <p className="mb-2">{t('userProfile.sosPrompt')}</p>
          <button
            onClick={handleSendSOS}
            className="bg-red-600 text-white px-3 py-1 rounded mr-2"
          >
            {t('userProfile.sendSOSConfirm')}
          </button>
          <button
            onClick={() => setShowSOSModal(false)}
            className="text-gray-500 underline"
          >
            {t('userProfile.cancel')}
          </button>
          {sosStatus && (
            <p className="mt-2 text-sm text-green-600">{sosStatus}</p>
          )}
        </Modal>
      )}
      <button
        onClick={() => setShowWeather((prev) => !prev)}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {showWeather ? t('userProfile.hideWeather') : t('userProfile.showWeather')}
      </button>

      {showWeather && (
        <div className="mt-4 border-t pt-4">
          <WeatherPage />
        </div>
      )}
    </div>
  );
};

export default UserDetailsCard;
