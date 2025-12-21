// models/migrate.js
const { pool } = require('../config/db');
require('dotenv').config();

async function runMigrations() {
  const force = process.env.FORCE_RESET === 'true';

  try {
    if (force) {
      console.warn('⚠️ FORCE_RESET=true -> Dropping tables (destructive).');
      
      await pool.execute('DROP TABLE IF EXISTS messages');
      await pool.execute('DROP TABLE IF EXISTS sessions');
      await pool.execute('DROP TABLE IF EXISTS refresh_tokens');
      await pool.execute('DROP TABLE IF EXISTS users');
      
      console.log('🗑️ Dropped existing tables.');
    }


    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(150) NOT NULL UNIQUE,
        email VARCHAR(200) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);


    await pool.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME NULL,
        emotion_score JSON NULL,
        summary TEXT NULL,
        duration_seconds INT GENERATED ALWAYS AS (TIMESTAMPDIFF(SECOND, start_time, end_time)) STORED,
        CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX (user_id),
        INDEX (start_time),
        INDEX (end_time)
      )
    `);

    // 3. Messages Table (Child of Sessions and Users)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT NOT NULL,
        user_id INT NOT NULL,
        sender ENUM('user','assistant') NOT NULL DEFAULT 'user',
        content TEXT NOT NULL,
        emotion_detected JSON NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_message_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        CONSTRAINT fk_message_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX (session_id),
        INDEX (user_id),
        INDEX (created_at)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at DATETIME NOT NULL,
        revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX (token),
        INDEX (user_id)
      )
    `);

    console.log('✅ Database synchronized successfully.');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

module.exports = runMigrations;