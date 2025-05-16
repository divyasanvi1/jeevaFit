import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoading } from "../context/LoadingContext";
import LoadingOverlay from "../components/LoadingOverlay"; 
import { useTranslation } from "react-i18next";

const ResendVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';
   
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const [userEmail, setUserEmail] = useState(initialEmail);

  console.log("userEmail",userEmail);
  const handleResend = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      setLoading(true); 
      const res = await axios.post('/api/resend-verification', { email: userEmail });
      setMessage(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend verification email.');
    }
    finally {
      setLoading(false); // Reset loading after the request is complete
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          {t('resend.title')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('resend.subtitle')}
        </p>

        <form onSubmit={handleResend} className="space-y-4">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {t('resend.button')}
          </button>
        </form>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        <button
          onClick={() => navigate('/login')}
          className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          {t('resend.gotoLogin')}
        </button>
      </div>
      <LoadingOverlay />
    </div>
  );
};

export default ResendVerification;
