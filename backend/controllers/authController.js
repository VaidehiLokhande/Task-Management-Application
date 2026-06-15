const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// 🔑 1. User Registration (Register)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,$4)
       RETURNING id,name,email,role`,
      [name, email, hashedPassword, role || "user"]
    );

    res.status(201).json({
      success: true,
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🔓 2. User Login (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        message: "This email ID was not found in the database! ❌",
      });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Incorrect password! Please try again. 🔒",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server Error: " + error.message,
    });
  }
};

// 👤 3. Profile Update (Update Name & Email)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, userId } = req.body;

    console.log("Backend received data for profile update:", { name, email, userId });

    if (!name || !email || !userId) {
      return res.status(400).json({
        message: `Missing fields. Received: name=${name}, email=${email}, userId=${userId}`,
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const updatedUser = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2 
       WHERE id = $3 
       RETURNING id, name, email, role`,
      [name, email, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({
        message: `User not found in database with ID: ${userId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully in database 🎉",
      user: updatedUser.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database error: " + error.message,
    });
  }
};

// 🔒 4. Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, userId } = req.body;

    console.log("Backend received data for password update for ID:", userId);

    if (!currentPassword || !newPassword || !userId) {
      return res.status(400).json({ message: "All fields are required! ❌" });
    }

    const userResult = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found! ❌" });
    }

    const dbPassword = userResult.rows[0].password;

    const isMatch = await bcrypt.compare(currentPassword, dbPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "The current password you entered is incorrect! ❌" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);

    res.status(200).json({ success: true, message: "Password updated successfully in the database! 🎉" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database Error: " + error.message });
  }
};