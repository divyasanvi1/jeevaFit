// src/components/HealthProfileQR.jsx
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';


const HealthProfileQR = ({ userId }) => {
  const profileUrl = `http://localhost:5173/profile/${userId}`;
  const { t } = useTranslation();
 console.log("profileUrl",profileUrl);

  return (
    <div className="text-center mt-4">
      <h2 className="text-lg font-bold">{t('healthProfileQR.title')}</h2>
      <QRCodeCanvas value={profileUrl} size={200} />
      <p className="mt-2 text-sm">{t('healthProfileQR.description')}</p>
    </div>
  );
};  

export default HealthProfileQR;
