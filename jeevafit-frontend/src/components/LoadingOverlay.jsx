// frontend/src/components/LoadingOverlay.jsx
import React from 'react';
import { useLoading } from '../context/LoadingContext';

const LoadingOverlay = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-transparent pointer-events-auto"
    role="alert"
    aria-live="assertive"
  >
    {/* Blur + click-block layer */}
    <div className="absolute inset-0 bg-transparent backdrop-blur-sm pointer-events-auto"></div>

    {/* Spinner and message */}
    <div className="relative z-10 flex flex-col items-center">
        <div className="h-20 w-20 border-8 border-t-orange-600 border-gray-200 rounded-full animate-spin mb-4"></div>
        <span className="text-orange-700 text-lg font-semibold">Please wait...</span>
      </div>
  </div>

  );
};

export default LoadingOverlay;
