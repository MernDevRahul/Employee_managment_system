const db = require("../config/db")

// Submit leave request
exports.requestLeave = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const { from_date, to_date, reason } = req.body;

  if (!from_date || !to_date || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let requested_to;

  if (role === 'employee') {
    const [result] = await db.query('SELECT manager_id FROM users WHERE id = ?', [userId]);
    if (!result[0]?.manager_id) return res.status(400).json({ message: 'Manager not found' });
    requested_to = result[0].manager_id;
  } else if (role === 'manager') {
    const [result] = await db.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    if (!result[0]?.id) return res.status(400).json({ message: 'Admin not found' });
    requested_to = result[0].id;
  } else {
    return res.status(403).json({ message: 'Admins cannot request leave' });
  }

  try {
    await db.query(
      `INSERT INTO leave_requests (user_id, requested_to, from_date, to_date, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, requested_to, from_date, to_date, reason]
    );

    res.status(201).json({ message: 'Leave request submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Approve/Reject leave (by manager/admin)
exports.decideLeave = async (req, res) => {
  const userId = req.user.id;
  const { leave_id, status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM leave_requests WHERE id = ?', [leave_id]);
    const leave = rows[0];

    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.requested_to !== userId) {
      return res.status(403).json({ message: 'Not authorized to decide on this leave' });
    }

    await db.query(
      `UPDATE leave_requests SET status = ?, decision_at = NOW() WHERE id = ?`,
      [status, leave_id]
    );

    res.status(200).json({ message: `Leave ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get own leave requests
exports.getMyLeaves = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT * FROM leave_requests WHERE user_id = ? ORDER BY requested_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin views all leaves
exports.getAllLeaves = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can access this' });
  }

  try {
    const [rows] = await db.query(
      `SELECT lr.*, u.name as user_name, u.role as user_role
       FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       ORDER BY lr.requested_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};