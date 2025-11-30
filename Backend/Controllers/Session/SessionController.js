// controllers/sessionController.js
const Session = require('../../model/Sessions');

async function startSession(req, res, next) {
  try {
    const userId = req.user.id;
    const created = await Session.create(userId);
    return res.status(201).json({ ok: true, data: { id: created.insertId } });
  } catch (err) {
    return next(err);
  }
}

async function endSession(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.sessionId, 10);
    const { summary = null, emotion_score = null } = req.body;

    const session = await Session.findById(sessionId);
    if (!session || session.user_id !== userId) {
      return res.status(404).json({ ok: false, error: 'Session not found or access denied' });
    }

    const updated = await Session.end(sessionId, userId, summary, emotion_score ? JSON.stringify(emotion_score) : null);
    if (updated.affectedRows === 0) return res.status(500).json({ ok: false, error: 'Failed to end session' });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

async function getUserSessions(req, res, next) {
  try {
    const userId = req.user.id;
    const sessions = await Session.findByUser(userId);
    return res.json({ ok: true, data: sessions });
  } catch (err) {
    return next(err);
  }
}

async function getSessionDetail(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.sessionId, 10);
    const session = await Session.findById(sessionId);
    if (!session || session.user_id !== userId) return res.status(404).json({ ok: false, error: 'Not found' });
    return res.json({ ok: true, data: session });
  } catch (err) {
    return next(err);
  }
}

async function deleteSession(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.sessionId, 10);
    const deleted = await Session.delete(sessionId, userId);
    if (deleted.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Not found or access denied' });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = { startSession, endSession, getUserSessions, getSessionDetail, deleteSession };
