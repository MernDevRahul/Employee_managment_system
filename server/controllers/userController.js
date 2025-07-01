const db = require("../config/db");

exports.getUsers = async (req, res) => {
  const { role } = req.query;

  try {
    const [users] = await db.query("SELECT id,name FROM users WHERE role=?", [
      role,
    ]);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const { role, id } = req.user;
  try {
    if (role == "admin") {
      const [rows] = await db.query(
        "SELECT id, name, role FROM users WHERE role IN (?,?)",
        ["manager", "employee"]
      );
      res.status(200).json(rows);
    }
    if (role == "manager") {
      const [rows] = await db.query(
        "SELECT id, name, role FROM users WHERE role=? AND manager_id=?",
        ["employee", id]
      );
      res.status(200).json(rows);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
