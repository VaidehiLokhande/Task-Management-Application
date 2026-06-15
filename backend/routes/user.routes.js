const express = require("express");
const router = express.Router();
// Controller मधून दोन्ही फंक्शन्स नीट इम्पोर्ट करा
const { getTeamMembers, inviteMember } = require("../controllers/userController");

// १. सर्व टीम मेंबर्स मिळवण्यासाठी (GET)
router.get("/team", getTeamMembers);

// २. नवीन मेंबर इन्व्हाईट करण्यासाठी (POST)
router.post("/invite", inviteMember);

// module.exports नेहमी फाईलच्या सर्वात शेवटी असावे!
module.exports = router;