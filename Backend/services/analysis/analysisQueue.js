const { pool } = require('../../config/db');

async function enqueueAnalysis(sessionId, userId) {
  await pool.execute(
    `
    INSERT IGNORE INTO analysis_jobs (session_id, user_id)
    VALUES (?, ?)
    `,
    [sessionId, userId]
  );
}

module.exports = { enqueueAnalysis };
