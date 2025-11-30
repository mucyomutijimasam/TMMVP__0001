// models/user.js
const { pool } = require('../config/db');

class User {
  static async createUser(username, email, passwordHash) {
    const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [username, email, passwordHash]);
    return { insertId: result.insertId };
  }

  static async findByEmail(email) {
    const query = 'SELECT id, username, email, password_hash AS passwordHash FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }
}

module.exports = User;
