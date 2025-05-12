import React, { useState } from 'react';
import { connectAndReadVitals } from '../../utils/bluetooth';
import axios from 'axios';

const BluetoothConnect = ({ userId }) => {
  const [vitals, setVitals] = useState(null);

  const handleConnect = async () => {
    try {
      const data = await connectAndReadVitals();
      setVitals(data);

      // Derived values (can also be computed in backend)
      
      data.userId = userId;
      
      // Get token from localStorage (or other storage method)
      const token = localStorage.getItem('token');
if (token) {
  await axios.post('http://localhost:8001/api/bluetooth/save', data, {
    withCredentials: true, // Ensure cookies (including auth_token) are sent with the request
  });
}


      alert('Vitals saved to database!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect or save vitals.');
    }
  };

  return (
    <div >
  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <span className="text-blue-600 text-2xl">🔗</span> Bluetooth Sync
  </h3>

  <button
    onClick={handleConnect}
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full shadow-sm transition duration-200"
  >
    Connect & Save
  </button>

  {vitals && (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Synced Vitals</h4>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-auto text-sm text-gray-700 font-mono whitespace-pre-wrap">
        {JSON.stringify(vitals, null, 2)}
      </div>
    </div>
  )}
</div>


  );
};

export default BluetoothConnect;
