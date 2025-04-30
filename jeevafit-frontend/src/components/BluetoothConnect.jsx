import React, { useState } from 'react';
import { connectAndReadVitals } from '../utils/bluetooth';
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
    <div>
      <button
        onClick={handleConnect}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Connect Bluetooth & Save Vitals
      </button>

      {vitals && (
        <pre className="mt-4 bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(vitals, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default BluetoothConnect;
