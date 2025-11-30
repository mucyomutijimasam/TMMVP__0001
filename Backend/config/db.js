// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.user,
  password: process.env.PASS,
  database: process.env.NAME,
  connectionLimit: 10,
  waitForConnections: true
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    console.log('✅ DB connection OK');
    conn.release();
  } catch (err) {
    console.error('❌ DB connection failed', err);
  }
}

module.exports = { pool, testConnection };
