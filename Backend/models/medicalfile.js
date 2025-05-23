const mongoose = require('mongoose');

const medicalUploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number },
  uploadDate: { type: Date, default: Date.now },
  extractedText: { type: String },
});

module.exports = mongoose.model('MedicalUpload', medicalUploadSchema);
