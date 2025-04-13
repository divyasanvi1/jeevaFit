const HealthData = require("../models/healthModel");
const User = require("../models/userModel");

// Utility to calculate BMI, Pulse Pressure, and MAP (no risk prediction)
function calculateDerivedFields(data, user) {
  const height = parseFloat(user.height);
  const weight = parseFloat(user.weight);

  let derived_BMI = null;
  if (height && !isNaN(height) && weight && !isNaN(weight)) {
    derived_BMI = parseFloat((weight / (height * height)).toFixed(2));
  }

  const pulsePressure = data.systolicBP - data.diastolicBP;
  const map = data.diastolicBP + (pulsePressure / 3);

  return {
    derived_BMI,
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

    const heartRate = Number(req.body.heartRate);
    const respiratoryRate = Number(req.body.respiratoryRate);
    const bodyTemperature = Number(req.body.bodyTemperature);
    const oxygenSaturation = Number(req.body.oxygenSaturation);
    const systolicBP = Number(req.body.systolicBP);
    const diastolicBP = Number(req.body.diastolicBP);
    const derived_HRV = Number(req.body.derived_HRV);

if (isNaN(heartRate) || isNaN(respiratoryRate) || isNaN(bodyTemperature) || isNaN(oxygenSaturation) || isNaN(systolicBP) || isNaN(diastolicBP) || isNaN(derived_HRV)) {
  return res.status(400).json({ msg: "Invalid data, all values must be numbers" });
}

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
