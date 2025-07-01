const express = require('express');
const router = express.Router();
const {
  createProject,
  assignToEmployee,
  getUserProjects,
  markAsCompleted,
  markAsInProgress,
  setDueDate,
  unassignedProjets
} = require('../controllers/projectController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware");

router.post('/admin/create', verifyToken, allowRoles("admin"), createProject);         // Admin only
router.post('/manager/assign', verifyToken, allowRoles("manager"), assignToEmployee);    // Manager only
router.put('/set-due-date/:id', verifyToken, allowRoles("manager"),setDueDate)
router.get('/me', verifyToken, getUserProjects);                  // Any logged in user
router.get('/unassigned', verifyToken, allowRoles("manager"), unassignedProjets)  // Manager get unassigned Task
router.put("/employee/markAsCompleted/:id", verifyToken, allowRoles("employee"), markAsCompleted)
router.put("/employee/markAsInProgress/:id", verifyToken, allowRoles("employee"),markAsInProgress)

module.exports = router;