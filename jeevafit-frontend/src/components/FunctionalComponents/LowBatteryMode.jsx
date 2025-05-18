// /src/components/LowBatteryMode.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


const LowBatteryMode = () => {
  const { t } = useTranslation();
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    const checkBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();

        const updateBatteryStatus = () => {
          // Check if battery is less than 20% (0.2 in decimal form)
          if (battery.level < 0.2) {
            setIsLowBattery(true);  // If battery is less than 20%, enable low battery mode
          } else {
            setIsLowBattery(false);
          }
        };

        updateBatteryStatus();  // Check initial battery status
        battery.addEventListener('levelchange', updateBatteryStatus);

        // Cleanup the event listener on unmount
        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
        };
      }
    };

    checkBatteryStatus();

    return () => {};
  }, []);

  return (
    <div>
      {isLowBattery ? (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
          <strong>{t('lowBattery.warningLabel')}:</strong> {t('lowBattery.warningMessage')}
        </div>
      ) : (
        <div>{t('lowBattery.okMessage')}</div>
      )}
    </div>
  );
};

export default LowBatteryMode;
