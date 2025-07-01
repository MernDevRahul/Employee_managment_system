const express = require('express');

const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { notifications, markAsRead } = require('../controllers/notificationsController');

router.get('/my', verifyToken, notifications);
router.put('/read/:id', verifyToken, markAsRead)

module.exports = router