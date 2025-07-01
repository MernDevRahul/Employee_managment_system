const express = require("express");
const { login, register, getMe } = require("../controllers/authController");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');


router.post("/login",login);
router.post('/register',register)
router.get('/me',verifyToken,getMe);

module.exports = router