// src/components/HealthCard.jsx
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const HealthCard = ({ value, maxValue = 100, label, color }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center w-[150px] h-[180px]">
      <div className="w-24 h-24">
        <CircularProgressbar
          value={value}
          maxValue={maxValue}
          text={`${value}`}
          styles={buildStyles({
            pathColor: color,
            textColor: "#333",
            trailColor: "#eee",
            textSize: "18px"
          })}
        />
      </div>
      <div className="mt-3 text-sm font-medium text-gray-700">{label}</div>
    </div>
  );
};

export default HealthCard;
