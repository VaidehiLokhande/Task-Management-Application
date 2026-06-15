const express = require("express");
const router = express.Router();

const { getTeamMembers, inviteMember } = require("../controllers/userController");


router.get("/team", getTeamMembers);


router.post("/invite", inviteMember);


module.exports = router;