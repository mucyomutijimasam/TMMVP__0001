// controllers/sessionController.js
const Session = require('../../model/Sessions');

async function createSession(req, res, next) {
  try {
    const userId = req.user.id;

    const created = await Session.create(userId);
    return res.status(201).json({
      ok: true,
      data: { id: created.insertId }
    });
  } catch (err) {
    return next(err);
  }
}

async function getSessions(req, res, next) {
  try {
    const userId = req.user.id;
    const sessions = await Session.findByUser(userId);
    return res.json({ ok: true, data: sessions });
  } catch (err) {
    return next(err);
  }
}

async function getSessionById(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.params.sessionId);

    const session = await Session.findById(sessionId);
    if (!session || session.user_id !== userId) {
      return res.status(404).json({ ok: false, error: 'Session not found' });
    }

    return res.json({ ok: true, data: session });
  } catch (err) {
    return next(err);
  }
}

async function updateSession(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.params.sessionId);
    const { summary, emotion_score } = req.body;

    const session = await Session.findById(sessionId);
    if (!session || session.user_id !== userId) {
      return res.status(404).json({ ok: false, error: 'Session not found' });
    }

    const updated = await Session.update(sessionId, userId, {
      summary,
      emotion_score
    });

    if (updated.affectedRows === 0) {
      return res.status(500).json({ ok: false, error: 'Update failed' });
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

async function endSession(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.params.sessionId);

    const ended = await Session.end(sessionId, userId);
    if (ended.affectedRows === 0) {
      return res.status(400).json({ ok: false, error: 'Session already ended or not found' });
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

async function deleteSession(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.params.sessionId);

    const deleted = await Session.delete(sessionId, userId);
    if (deleted.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: 'Session not found' });
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  endSession,
  deleteSession
};
