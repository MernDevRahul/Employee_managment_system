const express = require("express")
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  getTeamAttendance
} = require('../controllers/attendanceController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware");

router.post('/mark', verifyToken, allowRoles("manager", "employee"), markAttendance);
router.get('/me', verifyToken, getMyAttendance);
router.get('/all', verifyToken, allowRoles("admin"), getAllAttendance); // Admin only
router.get('/team', verifyToken, allowRoles("manager"), getTeamAttendance); // Manager only

module.exports = router;