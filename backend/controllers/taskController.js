const pool = require("../config/db");

// 1. Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, project_id, due_date, priority, status, assigned_to } = req.body;

    if (!title || !project_id) {
      return res.status(400).json({ success: false, message: "Title and Project are required" });
    }

    const newTask = await pool.query(
      `INSERT INTO tasks (title, description, project_id, due_date, priority, status, assigned_to) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        title, 
        description || null, 
        project_id, 
        due_date || null, 
        priority || 'Medium', 
        status || 'To Do', 
        assigned_to || null
      ]
    );

    res.status(201).json({ success: true, task: newTask.rows[0] });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ success: false, message: "Database Error: " + error.message });
  }
};

// 2. Get Tasks
// 1. Get Tasks - फक्त स्वतःचे टास्क्स दिसण्यासाठी अपडेट केले
exports.getTasks = async (req, res) => {
  try {
    // authMiddleware मधून आपल्याला req.user.id मिळतो (जो लॉग-इन युझर आहे)
    const loggedInUserId = req.user.id; 

    const tasks = await pool.query(
      `SELECT t.*, u.name as assigned_user_name 
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.assigned_to = $1 OR t.created_by = $1
       ORDER BY t.due_date ASC`,
      [loggedInUserId]
    );

    res.status(200).json({ success: true, tasks: tasks.rows });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Full Task - सिक्युरिटी चेक जोडला
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user.id; // लॉग-इन युझर
    const { title, description, project_id, due_date, priority, status, assigned_to } = req.body;

    // आधी चेक करा हे टास्क कोणाचे आहे
    const taskCheck = await pool.query("SELECT assigned_to, created_by FROM tasks WHERE id = $1", [id]);
    
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const task = taskCheck.rows[0];
    // जर लॉग-इन युझर नसेल असाइन केलेला किंवा त्याने बनवलेलं नसेल, तर ब्लॉक करा
    if (task.assigned_to !== loggedInUserId && task.created_by !== loggedInUserId) {
      return res.status(403).json({ success: false, message: "Unauthorized! You can only update your own tasks." });
    }

    const updatedTask = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, project_id = $3, due_date = $4, priority = $5, status = $6, assigned_to = $7
       WHERE id = $8 RETURNING *`,
      [title, description, project_id, due_date, priority, status, assigned_to, id]
    );

    res.status(200).json({ success: true, task: updatedTask.rows[0] });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Status Only - सिक्युरिटी चेक जोडला
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user.id;
    const { status, github_url } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    // सिक्युरिटी चेक
    const taskCheck = await pool.query("SELECT assigned_to, created_by FROM tasks WHERE id = $1", [id]);
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const task = taskCheck.rows[0];
    if (task.assigned_to !== loggedInUserId && task.created_by !== loggedInUserId) {
      return res.status(403).json({ success: false, message: "Unauthorized! You can only update your own tasks." });
    }

    const updatedTask = await pool.query(
      `UPDATE tasks SET status = $1, github_url = $2 WHERE id = $3 RETURNING *`,
      [status, github_url || null, id]
    );

    res.status(200).json({ 
      success: true, 
      message: "Task updated successfully!", 
      task: updatedTask.rows[0] 
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// 5. Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tasksResult = await pool.query(
      `SELECT t.*, p.name as project_name 
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = $1 OR t.created_by = $1
       ORDER BY t.due_date ASC`,
      [userId]
    );

    const tasks = tasksResult.rows;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
    const pendingTasks = tasks.filter(t => t.status === "Pending").length;

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks
      },
      recentTasks: tasks.slice(0, 5),
      upcomingDeadlines: tasks.filter(t => t.status !== "Completed").slice(0, 4)
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};