const express = require('express');

const router = express.Router()

const verifyToken = require('../middleware/authMiddleware');
const { getUsers, getAllUsers } = require('../controllers/userController');
const allowRoles = require('../middleware/roleMiddleware')

router.get("/users",verifyToken,getUsers);
router.get("/getAllUsers",verifyToken, allowRoles("admin","manager"),getAllUsers);

module.exports = router;