const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadMedicalFile, getUserUploads } = require('../controllers/uploadmedicalfile');
const { restrictToLoggedInUserOnly } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Upload endpoint
router.post('/upload-medical', restrictToLoggedInUserOnly , upload.single('file'), uploadMedicalFile);

// Get uploaded files
router.get('/user-uploads',restrictToLoggedInUserOnly ,  getUserUploads);

// **New: Download endpoint**
router.get('/download/:filename',restrictToLoggedInUserOnly ,  (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

module.exports = router;
