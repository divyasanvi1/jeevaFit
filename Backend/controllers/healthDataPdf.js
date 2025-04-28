const pdfParse = require('pdf-parse');
const HealthData = require('../models/HealthModel');

async function handleHealthPdfUpload(req, res) {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const text = data.text;
    console.log('Extracted PDF Text:', text); 
    const extractedHealthData = parseHealthDataFromText(text);
    console.log('Parsed Health Data:', extractedHealthData);
    const newHealthData = new HealthData({
      userId: req.body.userId,
      ...extractedHealthData,
    });

    await newHealthData.save();

    res.status(200).json({ message: 'Health data saved successfully' });
  } catch (error) {
    // Handle specific error messages from pdf-parse library
    if (error.message && error.message.includes('bad XRef entry')) {
      return res.status(400).json({ message: 'The PDF is corrupted or in an invalid format. Please upload a valid PDF.' });
    }
    console.error('Error uploading health PDF:', error);
    res.status(500).json({ message: 'Failed to process PDF', error });
  }
}

function parseHealthDataFromText(text) {
  const healthData = {};

  // Split text into non-empty trimmed lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (line.includes('heart rate')) {
      const value = extractNumber(lines[i + 1]);
      if (value !== null) healthData.heartRate = value;
    }

    if (line.includes('respiratory rate')) {
      const value = extractNumber(lines[i + 1]);
      if (value !== null) healthData.respiratoryRate = value;
    }

    if (line.includes('body temperature')) {
      const value = extractFloat(lines[i + 1]);
      if (value !== null) healthData.bodyTemperature = value;
    }

    if (line.includes('oxygen saturation')) {
      const value = extractNumber(lines[i + 1]);
      if (value !== null) healthData.oxygenSaturation = value;
    }

    if (line.includes('systolic bp')) {
      const value = extractNumber(lines[i + 1]);
      if (value !== null) healthData.systolicBP = value;
    }

    if (line.includes('diastolic bp')) {
      const value = extractNumber(lines[i + 1]);
      if (value !== null) healthData.diastolicBP = value;
    }

    if (line.includes('derived hrv')) {
      const value = extractNumber(lines[i + 1]);
      if (value !== null) healthData.derived_HRV = value;
    }

    if (line.includes('derived pulse pressure')) {
      const value = extractNumber(lines[i + 1]);
      if (value !== null) healthData.derived_Pulse_Pressure = value;
    }

    if (line.includes('derived bmi')) {
      const value = extractFloat(lines[i + 1]);
      if (value !== null) healthData.derived_BMI = value;
    }

    if (line.includes('derived map')) {
      const value = extractFloat(lines[i + 1]);
      if (value !== null) healthData.derived_MAP = value;
    }
  }

  return healthData;
}

// Helper to extract integer from text (removes non-digits)
function extractNumber(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

// Helper to extract float from text (removes non-digits except dot)
function extractFloat(text) {
  const match = text.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}


module.exports = { handleHealthPdfUpload };
