const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateProfile,
  changePassword, // 👈 कन्सोल करा की हे नाव आणि कंट्रोलरमधील नाव सेम आहे ना!
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.put("/update-profile", updateProfile);

// लाईन १६: जिथे एरर येतोय 💥
router.put("/change-password", changePassword); 

module.exports = router;