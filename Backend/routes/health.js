// routes/health.js
const express = require("express");
const router = express.Router();
const { handleAddHealthData } = require("../controllers/healthData");
const {restrictToLoggedInUserOnly}= require("../middleware/auth");

router.post("/add", restrictToLoggedInUserOnly, handleAddHealthData);

module.exports = router;
