// src/components/HealthProfileQR.jsx
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';


const HealthProfileQR = ({ userId }) => {
  const profileUrl = `http://localhost:5173/profile/${userId}`;
 console.log("profileUrl",profileUrl);
  return (
    <div className="text-center mt-4">
      <h2 className="text-lg font-bold">Your Health Profile QR</h2>
      <QRCodeCanvas value={profileUrl} size={200} />
      <p className="mt-2 text-sm">Scan this to access your health profile</p>
    </div>
  );
};  

export default HealthProfileQR;
