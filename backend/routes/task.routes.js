const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getDashboardStats,
  updateTaskStatus // 👈 १. हा नवीन कंट्रोलर इथे इंपोर्ट करायला हवा!
} = require("../controllers/taskController");

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.get("/dashboard-stats", authMiddleware, getDashboardStats);

// 👈 २. 🎯 हा नवीन राऊट इथे जोडला (जो लाईन १८ वर एरर देत होता)
router.put("/:id/status", authMiddleware, updateTaskStatus);

module.exports = router;