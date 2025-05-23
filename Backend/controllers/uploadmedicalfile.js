const MedicalUpload = require('../models/medicalfile');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const medicalKeywords = [
    // General medical terms
    "diagnosis", "prescription", "treatment", "x-ray", "blood", "hospital",
    "patient", "medicine", "test", "clinical", "symptoms", "doctor", "scan",
  
    // Vitals and structured health info
    "age", "gender", "weight", "height", "heart rate", "oxygen saturation", 
    "respiratory rate", "temperature", "blood pressure", "systolic", "diastolic",
    "spo2", "bpm", "hrv", "bmi", "map", "pulse pressure",
  ];
  

const isMedicalText = (text) => {
  let count = 0;
  for (const keyword of medicalKeywords) {
    if (text.toLowerCase().includes(keyword)) count++;
  }
  return count >= 2;
};

const uploadMedicalFile = async (req, res) => {
    try {
      console.log('Uploading file...');
      console.log('User:', req.user);
      console.log('File:', req.file);
  
      const file = req.file;
      const userId = req.user?.id;
  
      if (!file) {
        console.log("No file received");
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      // Check if the file exists on disk
      if (!fs.existsSync(file.path)) {
        console.error("Uploaded file not found on disk:", file.path);
        return res.status(500).json({ message: "Uploaded file not found on server" });
      }
  
      let extractedText = "";
  
      if (file.mimetype === "application/pdf") {
        console.log("Parsing PDF...");
        try {
          const data = fs.readFileSync(file.path);
          const pdf = await pdfParse(data);
          extractedText = pdf.text;
          console.log("Extracted PDF text:", extractedText.slice(0, 200));
        } catch (err) {
          console.error("PDF parse error:", err);
          throw err;
        }
      } else if (file.mimetype.startsWith("image/")) {
        console.log("Running OCR...");
        const result = await Tesseract.recognize(file.path, "eng");
        extractedText = result.data.text;
        console.log("Extracted OCR text:", extractedText.slice(0, 200));
      } else {
        console.log("Unsupported file type:", file.mimetype);
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: "Unsupported file type" });
      }
  
      if (!isMedicalText(extractedText)) {
        console.log("File doesn't appear medical");
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: "Not a medical-related file" });
      }
  
      console.log("Saving to DB...");
      const upload = await MedicalUpload.create({
        userId,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
        extractedText,
      });
  
      res.status(201).json({
        message: "Medical file uploaded successfully",
        file: upload,
      });
  
    } catch (err) {
      console.error("Upload failed:", err);
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        }
      }
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  };
  

// GET /api/user-uploads
const getUserUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = await MedicalUpload.find({ userId }).sort({ uploadDate: -1 });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve uploads", error: err.message });
  }
};

module.exports = {
  uploadMedicalFile,
  getUserUploads
};
