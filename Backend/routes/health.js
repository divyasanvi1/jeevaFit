// routes/health.js
const express = require("express");
const router = express.Router();
const { handleAddHealthData,handleGetUserHealthData } = require("../controllers/healthData");
const {restrictToLoggedInUserOnly}= require("../middleware/auth");

router.post("/add", restrictToLoggedInUserOnly, handleAddHealthData);
router.get("/user-data", restrictToLoggedInUserOnly, handleGetUserHealthData);

module.exports = router;
