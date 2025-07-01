const db = require('../config/db')

// Fetch notifications for user, with special logic for managers
exports.notifications = async (req, res) => {
    const id = req.user.id
    const role = req.user.role // Make sure your auth middleware sets req.user.role

    try {
        let rows;
        if(role=="admin"){
            [rows]= await db.query(`
                SELECT * FROM notifications`)
        }
        if (role === 'manager') {
            // Managers get their own notifications and those for projects assigned to them
            [rows] = await db.query(
                `SELECT n.id, n.message, n.is_read, n.created_at
                 FROM notifications n
                 WHERE n.user_id = ?
                    OR n.project_id IN (
                        SELECT p.id
                        FROM projects p
                        WHERE p.assigned_to_manager = ?
                    )
                 ORDER BY n.created_at DESC`,
                [id, id]
            );
        } else {
            // Other users get only their own notifications
            [rows] = await db.query(
                `SELECT id, message, is_read, created_at
                 FROM notifications
                 WHERE user_id = ?
                 ORDER BY created_at DESC`,
                [id]
            );
        }

        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

exports.markAsRead = async (req, res) => {
    const notificationId = req.params.id
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            `UPDATE notifications SET is_read = true
             WHERE id = ? AND user_id = ?`,
            [notificationId, userId]
        );
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}