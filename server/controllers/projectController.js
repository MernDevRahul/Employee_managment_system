const db = require('../config/db');

// Admin creates project and assigns to Manager
exports.createProject = async (req, res) => {

  console.log(req.body);
  
  const { title, description, assignee, dueDate } = req.body;
  const adminId = req.user.id;
  console.log(adminId);
  

  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const [result] = await db.query(
      'INSERT INTO projects (title, description, created_by, assigned_to_manager, due_date) VALUES (?, ?, ?, ?, ?)',
      [title, description, adminId, assignee, dueDate]
    );    
    res.status(201).json({ message: 'Project created', projectId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Manager assigns project to Employee
exports.assignToEmployee = async (req, res) => {
  const { project_id, employee_id } = req.body;
  const managerId = req.user.id;

  if (req.user.role !== 'manager') return res.status(403).json({ message: 'Access denied' });

  try {
    const [result] = await db.query(
      'INSERT INTO project_assignments (project_id, employee_id, assigned_by_manager) VALUES (?, ?, ?)',
      [project_id, employee_id, managerId]
    );
    res.status(201).json({ message: 'Project assigned to employee', assignmentId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// User fetches their projects
exports.getUserProjects = async (req, res) => {
  const { id, role } = req.user;

  try {
    if (role === 'admin') {
      const [rows] = await db.query('SELECT * FROM projects WHERE created_by = ?', [id]);
      return res.json(rows);
    }

    if (role === 'manager') {
      const [rows] = await db.query(
        `SELECT 
          p.id,
          p.title,
          p.description,
          p.due_date,
          p.status,
          p.created_at,
          p.updated_at,
          pa.id,
          pa.assigned_at,
          u.id as employee_id,
          u.name as employee_name,
          u.email as employee_email,
          CASE 
              WHEN pa.id IS NOT NULL THEN 'assigned'
              ELSE 'unassigned'
          END as assignment_status
      FROM projects p
      LEFT JOIN project_assignments pa ON p.id = pa.project_id
      LEFT JOIN users u ON pa.employee_id = u.id
      WHERE p.assigned_to_manager = ?
      ORDER BY p.created_at DESC, pa.assigned_at DESC`,
        [id]
      );
      return res.json(rows);
    }

    if (role === 'employee') {
      const [rows] = await db.query(
        `SELECT p.* FROM project_assignments pa
         JOIN projects p ON p.id = pa.project_id
         WHERE pa.employee_id = ?`,
        [id]
      );
      return res.json(rows);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// manager get Unassigned Tasks

exports.unassignedProjets = async(req,res)=>{
  const managerId = req.user.id;

  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [rows] = await db.query(
      `SELECT p.*
       FROM projects p
       LEFT JOIN project_assignments pa ON p.id = pa.project_id
       WHERE pa.project_id IS NULL
         AND p.assigned_to_manager = ?`,
      [managerId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Employee mark project as a completed

exports.markAsCompleted =  async (req, res) => {
  const taskId = req.params.id;
  const employeeId = req.user.id;

  try {
    // Ensure employee owns the task
    const [task] = await db.query(
      'SELECT * FROM projects WHERE id = ? AND employee_id = ?',
      [taskId, employeeId]
    );

    if (!task.length) {
      return res.status(403).json({ message: 'Unauthorized task update' });
    }

    await db.query('UPDATE projects SET status = "completed" WHERE id = ?', [taskId]);
    res.json({ message: 'Task marked as completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};

exports.markAsInProgress =  async (req, res) => {
  const taskId = req.params.id;
  const employeeId = req.user.id;

  console.log(taskId);
  console.log(employeeId);
  

  try {
    // Ensure employee owns the task
    const [task] = await db.query(
      'SELECT * FROM projects WHERE id = ?',
      [taskId]
    );
    console.log(task);
    

    if (!task.length) {
      return res.status(403).json({ message: 'Unauthorized task update' });
    }

    await db.query('UPDATE projects SET status = "in_progress" WHERE id = ?', [taskId]);
    res.json({ message: 'Task marked as completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};

exports.setDueDate = async(req,res)=>{
  const id = req.params.id;
  const { due_date } = req.body;
  const managerId = req.user.id;
  
  try {
    const [task] = await db.query(
      `SELECT * FROM projects WHERE id=? AND assigned_to_manager=?`,[id,managerId]);
      
    
      if(!task.length){
        return res.status(403).json({ message: "Unauthorized or task not found"})
      }

      await db.query('UPDATE projects SET due_date = ? WHERE id = ?',[due_date,id]);
      res.status(200).json({message:"Due date updated successfully" });
  } catch (error) {
    res.status(500).json({message:'Failed to update task Due Date'})
  }
}

