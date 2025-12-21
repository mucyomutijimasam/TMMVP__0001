const runMigrations = require('../../model/migrate');

async function resetDatabase(req, res, next) {
  try {
    // --- HARD ENVIRONMENT GUARDS ---
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        ok: false,
        error: 'Database reset is disabled in production'
      });
    }

    if (process.env.FORCE_RESET !== 'true') {
      return res.status(403).json({
        ok: false,
        error: 'FORCE_RESET is not enabled'
      });
    }

    // --- EXPLICIT CONFIRMATION ---
    const { confirm } = req.body;
    if (confirm !== 'RESET_DATABASE') {
      return res.status(400).json({
        ok: false,
        error: 'Confirmation string missing or invalid'
      });
    }

    console.warn('🔥 DATABASE RESET TRIGGERED BY USER:', req.user.id);

    await runMigrations();

    return res.json({
      ok: true,
      message: 'Database reset completed successfully'
    });

  } catch (err) {
    return next(err);
  }
}

module.exports = { resetDatabase };
