// Controllers/Analysis/SessionAnalysis
const Session = require('../../model/Sessions');
const SessionAnalysis = require('../../model/SessionAnalysis');

async function getSessionAnalysis(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.sessionId, 10);

    if (Number.isNaN(sessionId)) {
      return res.status(400).json({ ok: false, error: 'Invalid session ID' });
    }

    // 1. Verify session ownership
    const session = await Session.findById(sessionId);
    if (!session || session.user_id !== userId) {
      return res.status(404).json({ ok: false, error: 'Session not found' });
    }

    // 2. Fetch analysis
    const analysis = await SessionAnalysis.findBySession(sessionId, userId);
    if (!analysis) {
      return res.status(404).json({ ok: false, error: 'Session analysis not found' });
    }

    return res.json({ ok: true, data: analysis });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getSessionAnalysis };
