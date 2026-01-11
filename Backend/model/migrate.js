// models/migrate.js
const { pool } = require('../config/db');
require('dotenv').config();

async function runMigrations() {
  const force = process.env.FORCE_RESET === 'true';

  try {
if (force) {
    console.warn('⚠️ FORCE_RESET=true -> Dropping tables (destructive).');

    // 1. Drop the most "dependent" tables first (the grandchildren/children)
    await pool.execute('DROP TABLE IF EXISTS analysis_jobs'); // Fix typo (added S) and moved up
    await pool.execute('DROP TABLE IF EXISTS session_analysis');
    await pool.execute('DROP TABLE IF EXISTS messages');
    await pool.execute('DROP TABLE IF EXISTS refresh_tokens');

    // 2. Now you can drop the "Parent" tables
    await pool.execute('DROP TABLE IF EXISTS sessions');
    await pool.execute('DROP TABLE IF EXISTS users');

    console.log('🗑️ Dropped existing tables in correct dependency order.');
  }


// TABLE users
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

    //analyis Summary table
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS session_analysis (
          id INT AUTO_INCREMENT PRIMARY KEY,

          session_id INT NOT NULL UNIQUE,
          user_id INT NOT NULL,

          summary TEXT NOT NULL,

          primary_emotion ENUM(
                'calm',
                'anxious',
                'sad',
                'angry',
                'confused',
                'hopeful',
                'neutral'
           ) NOT NULL,

    emotion_distribution JSON NOT NULL,

    sentiment_score DECIMAL(3,2) NOT NULL,

    distress_score TINYINT NOT NULL,

    risk_level ENUM(
      'none',
      'low',
      'medium',
      'high',
      'critical'
    ) NOT NULL,

    risk_flags JSON NULL,

    assistant_confidence TINYINT NOT NULL,

    recommended_action ENUM(
      'continue',
      'slow_down',
      'grounding',
      'check_in',
      'escalate'
    ) NOT NULL,
     analyzed BOOLEAN DEFAULT false,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_analysis_session FOREIGN KEY (session_id)
      REFERENCES sessions(id) ON DELETE CASCADE,

    CONSTRAINT fk_analysis_user FOREIGN KEY (user_id)
      REFERENCES users(id) ON DELETE CASCADE,

    INDEX (user_id),
    INDEX (risk_level),
    INDEX (created_at)
  )
`);
// analysis_job for handling and adding resilience and failure problem

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS analysis_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL UNIQUE,
  user_id INT NOT NULL,

  status ENUM('pending','processing','done','failed') DEFAULT 'pending',
  attempts TINYINT DEFAULT 0,
  last_error TEXT NULL,

  available_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX (status),
  INDEX (available_at),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

    `)



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