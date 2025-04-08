const HealthData = require("../models/healthModel");
const User = require("../models/userModel");

// Utility to calculate BMI, Pulse Pressure, and MAP (no risk prediction)
function calculateDerivedFields(data, user) {
  const bmi = user.weight / (user.height * user.height);
  const pulsePressure = data.systolicBP - data.diastolicBP;
  const map = data.diastolicBP + (pulsePressure / 3);

  return {
    derived_BMI: parseFloat(bmi.toFixed(2)),
    derived_Pulse_Pressure: pulsePressure,
    derived_MAP: parseFloat(map.toFixed(2)),
  };
}

// POST /health/add
async function handleAddHealthData(req, res) {
  try {
    const userId = req.user.id; // Get from auth middleware
    console.log("userid",userId);
   // console.log("req",req);
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const {
      heartRate,
      respiratoryRate,
      bodyTemperature,
      oxygenSaturation,
      systolicBP,
      diastolicBP,
      derived_HRV
    } = req.body;

    const derived = calculateDerivedFields(
      { systolicBP, diastolicBP, heartRate, oxygenSaturation },
      user
    );

    const newData = await HealthData.create({
      userId,
      heartRate,
      respiratoryRate,
      bodyTemperature,
      oxygenSaturation,
      systolicBP,
      diastolicBP,
      derived_HRV,
      ...derived
    });

    res.status(201).json({ msg: "Health data added", data: newData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
  handleAddHealthData,
};
