import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ResendVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || '';
   console.log("userEmail",userEmail);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:8001/api/resend-verification', { email: userEmail });
      setMessage(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <p className="mb-6 text-gray-600">
          We’ve sent a verification link to your email.
        </p>

        <form onSubmit={handleResend} className="space-y-4">
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Resend Verification Email
          </button>
        </form>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {/* Login Button */}
        <button
          onClick={() => navigate('/login')}
          className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default ResendVerification;
