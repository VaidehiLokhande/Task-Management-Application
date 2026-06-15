const pool = require("../config/db");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await pool.query(
      `INSERT INTO projects(name, description, created_by)
       VALUES($1,$2,$3)
       RETURNING *`,
      [name, description, req.user.id]
    );

    res.status(201).json({
      success: true,
      project: project.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      projects: projects.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Project
exports.getProject = async (req, res) => {
  try {
    const project = await pool.query(
      "SELECT * FROM projects WHERE id=$1",
      [req.params.id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project: project.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updated = await pool.query(
      `UPDATE projects
       SET name=$1, description=$2
       WHERE id=$3
       RETURNING *`,
      [name, description, req.params.id]
    );

    res.json({
      success: true,
      project: updated.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM projects WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};