// models/message.js
const { pool } = require('../config/db');

class Message {
  static async create({ session_id, user_id, sender = 'user', content, emotion_detected = null }) {
    const [result] = await pool.execute(
      `INSERT INTO messages (session_id, user_id, sender, content, emotion_detected)
       VALUES (?, ?, ?, ?, ?)`,
      [session_id, user_id, sender, content, emotion_detected]
    );
    return { insertId: result.insertId };
  }

  static async update(id, content) {
    const [result] = await pool.execute(
      `UPDATE messages SET content = ?, updated_at = NOW() WHERE id = ?`,
      [content, id]
    );
    return { affectedRows: result.affectedRows };
  }

  static async findBySession(sessionId) {
    const [rows] = await pool.execute(
      'SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC',
      [sessionId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM messages WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM messages WHERE id = ?', [id]);
    return { affectedRows: result.affectedRows };
  }
}

module.exports = Message;
