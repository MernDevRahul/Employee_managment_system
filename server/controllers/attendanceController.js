const db = require("../config/db")

// Mark attendance
exports.markAttendance = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  console.log(userId);
  

  try {
    const [existing] = await db.query(
      'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    await db.query('INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)', [
      userId,
      today,
      'present'
    ]);

    res.status(201).json({ message: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get current user's attendance
exports.getMyAttendance = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query('SELECT * FROM attendance WHERE user_id = ?', [userId]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Get all attendance
exports.getAllAttendance = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can access this' });
  }

  try {
    const [rows] = await db.query(
      `SELECT a.id, u.name, u.role, a.date, a.status, a.marked_at
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.date DESC`
    );

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTeamAttendance = async(req,res)=>{
  const managerId = req.user.id

  try {
    // Check if user is a manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can access team attendance' });
    }

    // Get attendance data for all employees under this manager
    const [rows] = await db.query(
      `SELECT 
        a.id,
        u.name,
        u.email,
        u.role,
        a.date,
        a.status,
        a.marked_at,
        u.id as employee_id
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE u.manager_id = ? AND u.role = 'employee'
       ORDER BY a.date DESC, u.name ASC`,
      [managerId]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({message:"server error",error:error.message})
  }
}