const axios = require('axios');
const HealthData = require('../models/healthModel');
const User = require('../models/userModel');

exports.predictRiskLive = async (req, res) => {
  try {
    const { userId } = req.body;

    const latestHealth = await HealthData.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latestHealth) {
      return res.status(404).json({ error: 'No health data found for this user.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const pulsePressure = latestHealth.systolicBP - latestHealth.diastolicBP;
    const BMI = parseFloat(user.weight / (user.height * user.height)).toFixed(2);
    const MAP = parseFloat(
      latestHealth.diastolicBP + (1 / 3 * (latestHealth.systolicBP - latestHealth.diastolicBP))
    ).toFixed(2);
    

    const inputData = {
      "Heart_Rate": latestHealth.heartRate,
      "Respiratory_Rate": latestHealth.respiratoryRate,
      "Body_Temperature": latestHealth.bodyTemperature,
      "Oxygen_Saturation": latestHealth.oxygenSaturation,
      "Systolic_Blood_Pressure": latestHealth.systolicBP,
      "Diastolic_Blood_Pressure": latestHealth.diastolicBP,
      "Age": user.age,
      "Gender": user.gender.toLowerCase() === 'female' ? 1 : 0,
      "Weight (kg)": user.weight,
      "Height (m)": user.height,
      "Derived_HRV": latestHealth.derived_HRV || 0,
      "Derived_Pulse_Pressure": latestHealth.derived_Pulse_Pressure || pulsePressure,
      "Derived_BMI": parseFloat(latestHealth.derived_BMI || BMI),
      "Derived_MAP": latestHealth.derived_MAP || MAP
    };
    console.log("Sending gender", user.gender);
    console.log("Sending to model API:", inputData);

    const response = await axios.post('http://127.0.0.1:5000/predict', inputData);

    res.status(200).json({
      message: 'Prediction complete',
      input: inputData,
      result: response.data
    });

  } catch (error) {
    console.error('Prediction error:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Prediction failed' });
  }
};
