const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { name, email, password, role, manager_id } = req.body;
  
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    if (!['admin', 'manager', 'employee'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    try {
      // Check for existing user
      const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new user
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role, manager_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, manager_id || null]
      );
  
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.status(200).json({
        token,
        user:{
            id:user.id,
            name:user.name,
            role:user.role,
            email:user.email
        }
    });
  } catch (error) {
    res.status(500).json({message:'Server error',error:error.message});
  }
};


exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );

    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error in /auth/me:', err);
    res.status(500).json({ message: 'Server error' });
  }
};