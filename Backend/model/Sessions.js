// models/Session.js
const { pool } = require('../config/db');

class Session {
  static async create(userId) {
    const [result] = await pool.execute(
      `INSERT INTO sessions (user_id) VALUES (?)`,
      [userId]
    );
    return { insertId: result.insertId };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM sessions WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT * FROM sessions 
       WHERE user_id = ?
       ORDER BY start_time DESC`,
      [userId]
    );
    return rows;
  }

  static async update(id, userId, { summary = null, emotion_score = null }) {
    const [result] = await pool.execute(
      `UPDATE sessions
       SET summary = ?, emotion_score = ?
       WHERE id = ? AND user_id = ?`,
      [
        summary,
        emotion_score ? JSON.stringify(emotion_score) : null,
        id,
        userId
      ]
    );
    return { affectedRows: result.affectedRows };
  }

  static async end(id, userId) {
    const [result] = await pool.execute(
      `UPDATE sessions
       SET end_time = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ? AND end_time IS NULL`,
      [id, userId]
    );
    return { affectedRows: result.affectedRows };
  }

  static async delete(id, userId) {
    const [result] = await pool.execute(
      `DELETE FROM sessions WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return { affectedRows: result.affectedRows };
  }
  static async findActiveByUser(userId) {
  const [rows] = await pool.execute(
    `SELECT * FROM sessions 
     WHERE user_id = ? AND end_time IS NULL 
     ORDER BY start_time DESC 
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

}

module.exports = Session;
