const express = require("express");
const { handleUserSignUp, handleUserLogin, handleUserLogout, handleUpdateUserData, handleUserDetails } = require("../controllers/user");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", handleUserSignUp);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);
router.post("/update", handleUpdateUserData);
router.post("/details", handleUserDetails);
// Example of a protected route
// router.get("/profile", verifyToken, (req, res) => {
//     res.json({ msg: "Profile fetched", user: req.user });
// });

module.exports = router;
