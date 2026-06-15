const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateProfile,
  changePassword, // 
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.put("/update-profile", updateProfile);


router.put("/change-password", changePassword); 

module.exports = router;