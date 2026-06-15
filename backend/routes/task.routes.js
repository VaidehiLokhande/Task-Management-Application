const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getDashboardStats,
  updateTaskStatus // 
} = require("../controllers/taskController");

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.get("/dashboard-stats", authMiddleware, getDashboardStats);

router.put("/:id/status", authMiddleware, updateTaskStatus);

module.exports = router;