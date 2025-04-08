const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userJeevafit',
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

  heartRate: Number,                 // in bpm
  respiratoryRate: Number,          // in breaths per minute
  bodyTemperature: Number,          // in Celsius
  oxygenSaturation: Number,         // in %
  systolicBP: Number,               // upper blood pressure
  diastolicBP: Number,              // lower blood pressure

  // Derived/Calculated Fields
  derived_HRV: Number,
  derived_Pulse_Pressure: Number,
  derived_BMI: Number,
  derived_MAP: Number,

}, { timestamps: true });

const HealthData = mongoose.model('HealthData', healthDataSchema);
module.exports = HealthData;
