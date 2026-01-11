const { pool } = require('../config/db');
const { generateSessionAnalysis } = require('../services/analysis/sessionAnalysis');

const MAX_ATTEMPTS = 5;

async function runAnalysisWorker() {
  const [jobs] = await pool.execute(
    `
    SELECT * FROM analysis_jobs
    WHERE status = 'pending'
      AND available_at <= NOW()
    LIMIT 1
    FOR UPDATE
    `
  );

  if (jobs.length === 0) return;

  const job = jobs[0];

  try {
    await pool.execute(
      `UPDATE analysis_jobs SET status = 'processing' WHERE id = ?`,
      [job.id]
    );

    await generateSessionAnalysis(job.session_id, job.user_id);

    await pool.execute(
      `UPDATE analysis_jobs SET status = 'done' WHERE id = ?`,
      [job.id]
    );

  } catch (err) {
    const attempts = job.attempts + 1;
    const failed = attempts >= MAX_ATTEMPTS;

    await pool.execute(
      `
      UPDATE analysis_jobs
      SET
        status = ?,
        attempts = ?,
        last_error = ?,
        available_at = DATE_ADD(NOW(), INTERVAL POW(2, ?) MINUTE)
      WHERE id = ?
      `,
      [
        failed ? 'failed' : 'pending',
        attempts,
        err.message,
        attempts,
        job.id
      ]
    );
  }
}

module.exports = { runAnalysisWorker };
