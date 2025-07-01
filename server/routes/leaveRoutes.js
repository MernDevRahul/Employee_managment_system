const express = require('express');
const router = express.Router();
const {
  requestLeave,
  decideLeave,
  getMyLeaves,
  getAllLeaves
} = require('../controllers/leaveController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware')

router.post('/request', verifyToken,allowRoles("employee", "manager"), requestLeave);
router.post('/decide', verifyToken, allowRoles("manager", "admin"), decideLeave); // approve/reject
router.get('/me', verifyToken, getMyLeaves);

router.get('/all', verifyToken,allowRoles('admin'), getAllLeaves); // admin only

module.exports = router;