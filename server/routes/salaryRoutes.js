const express = require('express');
const router = express.Router();
const {
  generateMonthlySalary,
  getAllSalaries,
  getMySalary,
  getPaidSalary,
} = require('../controllers/salaryController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware")

router.post('/generate', verifyToken, allowRoles("admin"), generateMonthlySalary); // Admin only
router.get('/all', verifyToken, allowRoles("admin"), getAllSalaries); // Admin only
router.get('/me', verifyToken, allowRoles("manager", "employee"), getMySalary); // Any user
router.post('/salary/pay/:id', verifyToken, allowRoles("admin"), getPaidSalary);  //Admin only


module.exports = router;