const HealthData = require('../models/healthModel');

// Save health vitals (Bluetooth)
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

    // Derived metrics
    const derived_Pulse_Pressure = parseFloat((systolicBP - diastolicBP).toFixed(2));
const derived_MAP = parseFloat(((2 * diastolicBP + systolicBP) / 3).toFixed(2));
console.log("mappp",derived_MAP);
     // If you don’t have height/weight, set null
     console.log("derived_HRV",derived_HRV);
     const userId= req.user._id || req.user.id;
    const newVitals = new HealthData({
      userId, // Assumes auth middleware sets req.user
      heartRate,
      respiratoryRate,
      bodyTemperature,
      oxygenSaturation,
      systolicBP,
      diastolicBP,
      derived_HRV,
      derived_Pulse_Pressure,
      derived_MAP,
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
