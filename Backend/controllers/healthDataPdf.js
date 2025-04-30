const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');

const HealthData = require('../models/HealthModel');

// Function to parse PDF
const parsePdf = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }

  return text;
};

// Controller to handle PDF upload and save to database
exports.handleHealthPdfUpload = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    // Ensure the file is a valid PDF
    if (!file || file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Invalid file format' });
    }

    console.log('Received file:', file);
    console.log('Received body:', req.body);

    // Parse the PDF
    const pdfText = await parsePdf(file.buffer);
    console.log('Extracted PDF Text:', pdfText);

    // Extract health metrics using flexible regex
    const extractValue = (label, unit) => {
      const regex = new RegExp(`${label}[:\\s]+(\\d+(\\.\\d+)?)\\s*${unit}`);
      const match = pdfText.match(regex);
      console.log(`Extracting ${label}:`, match ? match[1] : 'NOT FOUND');
      return match ? parseFloat(match[1]) : undefined;
    };
    
    // Extract values
    const heartRate = extractValue('Heart Rate', 'bpm');
    const respiratoryRate = extractValue('Respiratory Rate', 'breaths per minute');
    const bodyTemperature = extractValue('Body Temperature', '°C');
    const oxygenSaturation = extractValue('Oxygen Saturation', '%');
    const systolicBP = extractValue('Systolic BP', 'mmHg');
    const diastolicBP = extractValue('Diastolic BP', 'mmHg');
    const derivedHRV = extractValue('Derived HRV', 'ms');
    const pulsePressure = extractValue('Derived Pulse Pressure', 'mmHg');
    const bmi = extractValue('BMI', '');
    const map = extractValue('Derived MAP', 'mmHg');

    // Create and save a new health data record in the database
    const healthData = new HealthData({
      userId,       // User who uploaded the PDF
      heartRate,
      respiratoryRate,
      bodyTemperature,
      oxygenSaturation,
      systolicBP,
      diastolicBP,
      derived_HRV:derivedHRV,
      derived_Pulse_Pressure:pulsePressure,
      derived_BMI:bmi ,
      derived_MAP:map,
              // The parsed text from the PDF
    });

    await healthData.save();  // Save to the database
    console.log('Health data saved successfully');

    // Respond with success message
    res.json({ message: 'PDF uploaded and parsed successfully!', data: healthData });
  } catch (error) {
    console.error('PDF parsing failed:', error);
    res.status(400).json({ message: 'PDF parsing failed.' });
  }
};