const db = require('../config/db'); // Adjust the path if needed
const dayjs = require('dayjs');

const notifyDueTasks = async () => {
  try {
    const today = dayjs().startOf('day');
    const tomorrow = today.add(1, 'day').format('YYYY-MM-DD');

    // ✅ 1. Get projects due tomorrow
    const [dueTomorrow] = await db.query(
      `
      SELECT pa.employee_id, p.title, p.id
      FROM projects p
      JOIN project_assignments pa ON p.id = pa.project_id
      WHERE p.due_date = ? AND p.status != 'completed'
      `,
      [tomorrow]
    );

    for (const row of dueTomorrow) {
        // console.log({dueTomorrow:row});
        
      const [existing] = await db.query(
        `SELECT 1 FROM notifications WHERE user_id = ? AND project_id = ? AND message = ?`,
        [row.employee_id, row.id, `📅 Reminder: Project "${row.title}" is due tomorrow.`]
      );

      if (existing.length === 0) {
        await db.query(
          `
          INSERT INTO notifications (user_id, message, project_id)
          VALUES (?, ?, ?)
          `,
          [
            row.employee_id,
            `📅 Reminder: Project "${row.title}" is due tomorrow.`,
            row.id
          ]
        );
      }
    }

    // ✅ 2. Get overdue projects
    const [overdue] = await db.query(
      `
      SELECT pa.employee_id, p.title, p.id
      FROM projects p
      JOIN project_assignments pa ON p.id = pa.project_id
      WHERE p.due_date < CURDATE() AND p.status != 'completed'
      `
    );
    // console.log(overdue);
    

    for (const row of overdue) {
      // console.log({overdue:row});
      
      const [existing] = await db.query(
        `SELECT 1 FROM notifications WHERE user_id = ? AND project_id = ? AND message = ?`,
        [row.employee_id, row.id, `⚠️ Project "${row.title}" is overdue!`]
      );

      if (existing.length === 0) {
        await db.query(
          `
          INSERT INTO notifications (user_id, message, project_id)
          VALUES (?, ?, ?)
          `,
          [
            row.employee_id,
            `⚠️ Project "${row.title}" is overdue!`,
            row.id,
          ]
        );
      }
    }

    console.log(`[CRON] Project reminders sent at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error('[CRON] Failed to send project deadline reminders:', err);
  }
};

module.exports = notifyDueTasks;