const db = require('../config/db');

// Generate salaries for a given month
exports.generateMonthlySalary = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can generate salaries' });
  }

  const { month_year, total_days, base_salary_default } = req.body;

  if (!month_year || !total_days || !base_salary_default) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const [users] = await db.query(`SELECT id FROM users WHERE role IN ('employee', 'manager')`);

    for (const user of users) {
      const userId = user.id;

      // Count presents
      const [presentCount] = await db.query(
        `SELECT COUNT(*) AS count FROM attendance 
         WHERE user_id = ? AND status = 'present' AND DATE_FORMAT(date, '%Y-%m') = ?`,
        [userId, month_year]
      );

      // Count approved leaves
      const [leaveCount] = await db.query(
        `SELECT COUNT(*) AS count FROM leave_requests 
         WHERE user_id = ? AND status = 'approved' AND 
         DATE_FORMAT(from_date, '%Y-%m') = ?`,
        [userId, month_year]
      );

      const present = presentCount[0].count;
      const leaves = leaveCount[0].count;

      const netSalary = (present + leaves) / total_days * base_salary_default;

      await db.query(
        `INSERT INTO salaries (user_id, month_year, base_salary, present_days, paid_leaves, total_days, net_salary)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         present_days = VALUES(present_days),
         paid_leaves = VALUES(paid_leaves),
         net_salary = VALUES(net_salary),
         generated_at = CURRENT_TIMESTAMP`,
        [userId, month_year, base_salary_default, present, leaves, total_days, netSalary.toFixed(2)]
      );
    }

    res.status(200).json({ message: 'Salaries generated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin view all salaries
exports.getAllSalaries = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can view all salaries' });
  }

  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name, u.role 
       FROM salaries s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.generated_at DESC`
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Individual salary view
exports.getMySalary = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT * FROM salaries WHERE user_id = ? ORDER BY generated_at DESC`,
      [userId]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPaidSalary = async(req, res)=>{
  const salaryId = req.params.id;
  try {
    const today = new Date().toISOString().split("T")[0];

    await db.query(`
      UPDATE salary SET status = 'paid', payment_date = ? WHERE id = ?
      `,[today, salaryId])

      res.status(200).json({message:"Salary marked as paid"});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}