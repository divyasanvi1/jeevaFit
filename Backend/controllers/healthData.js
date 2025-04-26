const HealthData = require("../models/healthModel");
const User = require("../models/userModel");

// Utility to calculate BMI, Pulse Pressure, and MAP (no risk prediction)
function calculateDerivedFields(data = {}, user = {}) {
  const height = parseFloat(user.height);
  const weight = parseFloat(user.weight);

  let derived_BMI = null;
  if (height && !isNaN(height) && weight && !isNaN(weight)) {
    derived_BMI = parseFloat((weight / (height * height)).toFixed(2));
  }

  const systolic = data.systolicBP ?? 0;
  const diastolic = data.diastolicBP ?? 0;

  const pulsePressure = systolic - diastolic;
  const map = diastolic + (pulsePressure / 3);
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
// Range validation
const isValid =
heartRate >= 30 && heartRate <= 220 &&
respiratoryRate >= 5 && respiratoryRate <= 60 &&
bodyTemperature >= 30 && bodyTemperature <= 45 &&
oxygenSaturation >= 70 && oxygenSaturation <= 100 &&
systolicBP >= 70 && systolicBP <= 200 &&
diastolicBP >= 40 && diastolicBP <= 160 &&
derived_HRV >= 0 && derived_HRV <= 100;

if (!isValid) {
  const io = req.app.get("io");

  // Emit a fatal alert to only the user
  io.to(userId.toString()).emit("fatalHealthAlert", {
    userId,
    values: {
      heartRate,
      respiratoryRate,
      bodyTemperature,
      oxygenSaturation,
      systolicBP,
      diastolicBP,
      derived_HRV,
    },
    reason: "Abnormal or dangerous health data detected. Please check your inputs.",
  });

  return res.status(400).json({
    msg: "Abnormal or dangerous health data detected. Please check your inputs.",
  });
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
      // ✅ Emit to Socket.IO clients
    const io = req.app.get("io");
    io.emit("healthDataUpdated", {
      userId,
      data: newData,
    });
    res.status(201).json({ msg: "Health data added", data: newData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}

async function handleGetUserHealthData(req, res) {
  try {
    const userId = req.user.id;
     console.log("userId",userId);
    // 1. Fetch user data (for latest weight & height)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const height = parseFloat(user.height);
    const weight = parseFloat(user.weight);
    const bmi = height && weight ? parseFloat((weight / (height * height)).toFixed(2)) : null;

    // 2. Get all health data
    const healthData = await HealthData.find({ userId }).sort({ timestamp: -1 });

    // 3. Inject updated BMI into each record (if valid height/weight exist)
    const updatedHealthData = healthData.map(entry => ({
      ...entry.toObject(),
      derived_BMI: bmi ?? entry.derived_BMI // fallback to stored value if calculation fails
    }));

    // 4. Send updated response
    res.status(200).json({ data: updatedHealthData });

  } catch (err) {
    console.error("Error fetching health data:", err);
    res.status(500).json({ msg: "Failed to fetch health data", error: err.message });
  }
}

module.exports = {
  handleAddHealthData,
  handleGetUserHealthData
};
