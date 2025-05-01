const vitalRanges = {
    "Heart Rate": {
      unit: "bpm",
      male: { min: 60, max: 85 },
      female: { min: 70, max: 95 },
    },
    "SpO₂": {
      unit: "%",
      male: { min: 90, max: 100 },
      female: { min: 90, max: 100 },
    },
    "Temperature": {
      unit: "°C",
      male: { min: 36, max: 38 },
      female: { min: 36, max: 38 },
    },
    "Respiratory Rate": {
      unit: "breaths/min",
      male: { min: 12, max: 20 },
      female: { min: 12, max: 22 },
    },
    "Systolic BP": {
      unit: "mmHg",
      male: { min: 90, max: 140 },
      female: { min: 90, max: 130 },
    },
    "Diastolic BP": {
      unit: "mmHg",
      male: { min: 60, max: 90 },
      female: { min: 60, max: 85 },
    },
    "HRV": {
      unit: "ms",
      male: { min: 25, max: 100 },
      female: { min: 20, max: 90 },
    },
    "BMI": {
      unit: "",
      male: { min: 18.5, max: 25 },
      female: { min: 18.5, max: 25 },
    },
    "Pulse Pressure": {
      unit: "mmHg",
      male: { min: 30, max: 60 },
      female: { min: 30, max: 60 },
    },
    "MAP": {
      unit: "mmHg",
      male: { min: 70, max: 110 },
      female: { min: 70, max: 110 },
    }
  };
  
  export default vitalRanges;
  