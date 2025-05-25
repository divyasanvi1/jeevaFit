const HealthData = require('../models/healthModel');
const User= require('../models/userModel')
// Save health vitals (Bluetooth)
function roundToTwo(value) {
  return value !== undefined ? parseFloat(parseFloat(value).toFixed(2)) : undefined;
}

exports.saveVitals = async (req, res) => {
    console.log("req",req);
  try {
    const {
      heartRate,
      respiratoryRate,
      bodyTemperature,
      oxygenSaturation,
      systolicBP,
      diastolicBP,
      derived_HRV,
    } = req.body;
    const userId= req.user._id || req.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const incomingData = {
      heartRate: roundToTwo(heartRate),
      respiratoryRate: roundToTwo(respiratoryRate),
      bodyTemperature: roundToTwo(bodyTemperature),
      oxygenSaturation: roundToTwo(oxygenSaturation),
      systolicBP: roundToTwo(systolicBP),
      diastolicBP: roundToTwo(diastolicBP),
      derived_HRV: roundToTwo(derived_HRV),
    };
    
    const latestVitals = await HealthData.findOne({ userId }).sort({ createdAt: -1 });

    // ⛔ Enforce full vitals if it's the user's first submission
    if (!latestVitals && Object.values(incomingData).filter(v => v !== undefined).length < 7) {
      return res.status(400).json({ error: 'Initial full vitals required (all 7 fields).' });
    }
    const user = await User.findById(userId);
    if (!user || !user.height || !user.weight) {
      return res.status(400).json({ error: 'User profile incomplete: height and weight required.' });
    }
    // Derived metrics
   
    const mergedData = {
      heartRate: incomingData.heartRate ?? latestVitals?.heartRate,
      respiratoryRate: incomingData.respiratoryRate ?? latestVitals?.respiratoryRate,
      bodyTemperature: incomingData.bodyTemperature ?? latestVitals?.bodyTemperature,
      oxygenSaturation: incomingData.oxygenSaturation ?? latestVitals?.oxygenSaturation,
      systolicBP: incomingData.systolicBP ?? latestVitals?.systolicBP,
      diastolicBP: incomingData.diastolicBP ?? latestVitals?.diastolicBP,
      derived_HRV: incomingData.derived_HRV ?? latestVitals?.derived_HRV,
    };
    const isValid =
    mergedData.heartRate >= 40 && mergedData.heartRate <= 130 &&
    mergedData.respiratoryRate >= 12 && mergedData.respiratoryRate <= 22 &&
    mergedData.bodyTemperature >= 35 && mergedData.bodyTemperature <= 39 &&
    mergedData.oxygenSaturation >= 85 && mergedData.oxygenSaturation <= 100 &&
    mergedData.systolicBP >= 80 && mergedData.systolicBP <= 150 &&
    mergedData.diastolicBP >= 40 && mergedData.diastolicBP <= 130 &&
    mergedData.derived_HRV >= 0.0 && mergedData.derived_HRV <= 0.9;

  if (!isValid) {
    return res.status(400).json({ error: 'One or more vitals are out of acceptable range. Not saved.' });
  }
     // If you don’t have height/weight, set null
     const derived_BMI = parseFloat((user.weight / (user.height * user.height)).toFixed(2));
     
     const newVitals = new HealthData({
      userId,
      ...mergedData,
      derived_BMI,
      ...(mergedData.systolicBP && mergedData.diastolicBP && {
        derived_Pulse_Pressure: roundToTwo(mergedData.systolicBP - mergedData.diastolicBP),
        derived_MAP: roundToTwo((2 * mergedData.diastolicBP + mergedData.systolicBP) / 3),
      }),
    });

    await newVitals.save();
    // ✅ Emit via Socket.IO to user's room
    const io = req.app.get('io');
    if (io) {
      io.to(userId.toString()).emit('vitals-updated', newVitals);
      console.log(`🔔 Emitted vitals to user ${userId}`);
    }

    res.status(201).json({ message: 'Vitals saved', data: newVitals });
  } catch (err) {
    console.error('Error saving vitals:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
