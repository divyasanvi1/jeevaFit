const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');

const HealthData = require('../models/healthModel');

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
    const extractValue = (labels, units = []) => {
      if (!Array.isArray(labels)) labels = [labels];
      if (!Array.isArray(units)) units = [units];
    
      for (let label of labels) {
        const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Pattern 1: Label (unit)   value
        const bracketPattern = new RegExp(`${escapedLabel}\\s*\\(.*?\\)\\s*([\\d.]+)`, 'i');
        const matchBracket = pdfText.match(bracketPattern);
        if (matchBracket) {
          console.log(`Extracting ${label} (bracket):`, matchBracket[1]);
          return parseFloat(matchBracket[1]);
        }
    
        // Pattern 2: Label: value unit
        for (let unit of units) {
          const escapedUnit = unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const colonPattern = new RegExp(`${escapedLabel}\\s*[:\\s]+([\\d.]+)\\s*${escapedUnit}`, 'i');
          const matchColon = pdfText.match(colonPattern);
          if (matchColon) {
            console.log(`Extracting ${label} (colon):`, matchColon[1]);
            return parseFloat(matchColon[1]);
          }
    
          // Pattern 3: Label unit value (e.g. Heart Rate bpm 80)
          const inlinePattern = new RegExp(`${escapedLabel}\\s*${escapedUnit}\\s*([\\d.]+)`, 'i');
          const matchInline = pdfText.match(inlinePattern);
          if (matchInline) {
            console.log(`Extracting ${label} (inline):`, matchInline[1]);
            return parseFloat(matchInline[1]);
          }
        }
    
        // Pattern 4: Label   value (no unit)
        const loosePattern = new RegExp(`${escapedLabel}\\s+([\\d.]+)`, 'i');
        const matchLoose = pdfText.match(loosePattern);
        if (matchLoose) {
          console.log(`Extracting ${label} (loose):`, matchLoose[1]);
          return parseFloat(matchLoose[1]);
        }
      }
    
      console.log(`Extracting ${labels[0]}: NOT FOUND`);
      return undefined;
    };
    
    
    // Extract values
    const heartRate = extractValue(['Heart Rate'], ['bpm']);
    const respiratoryRate = extractValue(['Respiratory Rate'], ['breaths/min', 'breaths per minute']);
    const bodyTemperature = extractValue(['Body Temperature'], ['°C', 'C']);
    const oxygenSaturation = extractValue(['Oxygen Saturation'], ['%', 'percent']);
    const systolicBP = extractValue(['Systolic BP'], ['mmHg']);
    const diastolicBP = extractValue(['Diastolic BP'], ['mmHg']);
    const derivedHRV = extractValue(['Heart Rate Variability', 'HRV'], ['ms']);
    const pulsePressure = extractValue(['Derived Pulse Pressure', 'Pulse Pressure'], ['mmHg']);
    const bmi = extractValue(['Derived BMI', 'BMI'], []);
    const map = extractValue(['Derived MAP', 'MAP'], ['mmHg']);
    

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