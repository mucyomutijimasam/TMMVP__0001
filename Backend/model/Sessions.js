// models/session.js
const { pool } = require('../config/db');

class Session {
  static async create(userId) {
    const [result] = await pool.execute(
      'INSERT INTO sessions (user_id) VALUES (?)',
      [userId]
    );
    return { insertId: result.insertId };
  }

  static async end(sessionId, userId, summary = null, emotionScore = null) {
    const [result] = await pool.execute(
      `UPDATE sessions SET end_time = CURRENT_TIMESTAMP, summary = ?, emotion_score = ?
       WHERE id = ? AND user_id = ?`,
      [summary, emotionScore, sessionId, userId]
    );
    return { affectedRows: result.affectedRows };
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY start_time DESC',
      [userId]
    );
    return rows;
  }

  static async findById(sessionId) {
    const [rows] = await pool.execute(
      'SELECT * FROM sessions WHERE id = ?',
      [sessionId]
    );
    return rows[0] || null;
  }

  static async delete(sessionId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );
    return { affectedRows: result.affectedRows };
  }
}

module.exports = Session;
