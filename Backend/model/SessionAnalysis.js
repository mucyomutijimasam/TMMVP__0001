const { pool } = require('../config/db');

class SessionAnalysis {
  static async findBySession(sessionId, userId) {
    const [rows] = await pool.execute(
      `
      SELECT *
      FROM session_analysis
      WHERE session_id = ? AND user_id = ?
      LIMIT 1
      `,
      [sessionId, userId]
    );

    return rows[0] || null;
  }
}

module.exports = SessionAnalysis;
