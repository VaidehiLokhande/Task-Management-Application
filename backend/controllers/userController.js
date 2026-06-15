const pool = require("../config/db");
const bcrypt = require("bcrypt"); // 👈 खात्री करा की bcrypt इम्पोर्ट केला आहे


// Get All Team Members from Database
exports.getTeamMembers = async (req, res) => {
  try {
    // Fetching user details with profiles metadata directly
    const team = await pool.query(
      `SELECT id, name, email, role, expertise, status 
       FROM users 
       ORDER BY name ASC`
    );

    res.status(200).json({
      success: true,
      team: team.rows
    });
    
  } catch (error) {
    console.error("Fetch Team Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
    });
  }

};
// Invite / Create New Member
// Invite / Create New Member (Safe from Password Not-Null Constraint)

// Invite / Create New Member with proper Password Hashing
exports.inviteMember = async (req, res) => {
  try {
    const { name, email, role, expertise, status, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, Email, and Password are required" });
    }

    // 1. Check if user already exists
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // 2. Hash the password before saving (This ensures login authentication passes)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insert into database with hashed password
    const newMember = await pool.query(
      `INSERT INTO users (name, email, password, role, expertise, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, expertise, status`,
      [
        name, 
        email, 
        hashedPassword, // 👈 प्लेन टेक्स्ट ऐवजी हॅश केलेला पासवर्ड जाईल
        role || "Contributor", 
        expertise || "React, Node.js", 
        status || "Active"
      ]
    );

    res.status(201).json({
      success: true,
      member: newMember.rows[0]
    });
  } catch (error) {
    console.error("Invite Member Controller Error:", error);
    res.status(500).json({ success: false, message: "Database Error: " + error.message });
  }
};