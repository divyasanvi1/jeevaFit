const express = require('express');
const multer = require('multer');
const { handleHealthPdfUpload } = require('../controllers/healthDataPdf');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-health-pdf', upload.single('file'), handleHealthPdfUpload);

module.exports = router;
