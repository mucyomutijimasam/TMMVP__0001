// controllers/messageController.js
const Message = require('../../model/Messages');
const Session = require('../../model/Sessions');

async function sendMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.sessionId, 10);
    const { sender = 'user', content, emotion_detected = null } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });

    // ownership: only session owner can post messages (for now)
    if (session.user_id !== userId) return res.status(403).json({ ok: false, error: 'Access denied' });

    const created = await Message.create({
      session_id: sessionId,
      user_id: userId,
      sender,
      content,
      emotion_detected: emotion_detected ? JSON.stringify(emotion_detected) : null
    });

    return res.status(201).json({ ok: true, data: { id: created.insertId } });
  } catch (err) {
    return next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.sessionId, 10);

    const session = await Session.findById(sessionId);
    if (!session || session.user_id !== userId) return res.status(404).json({ ok: false, error: 'Not found or access denied' });

    const messages = await Message.findBySession(sessionId);
    return res.json({ ok: true, data: messages });
  } catch (err) {
    return next(err);
  }
}

async function updateMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const messageId = parseInt(req.params.messageId, 10);
    const { content } = req.body; // Only allow updating the content

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ ok: false, error: 'Content is required for update' });
    }

    const message = await Message.findById(messageId);
    
    // 1. Check if message exists
    if (!message) {
        return res.status(404).json({ ok: false, error: 'Message not found' });
    }
    
    // 2. Check ownership
    if (message.user_id !== userId) {
        return res.status(403).json({ ok: false, error: 'Access denied' });
    }
    
    // 3. Update the message in the database
    const updated = await Message.update(messageId, content);

    if (updated.affectedRows === 0) {
        // This could happen if the content was identical or update failed
        return res.status(500).json({ ok: false, error: 'Failed to update message' });
    }

    return res.json({ ok: true, data: { messageId } });

  } catch (err) {
    return next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const messageId = parseInt(req.params.messageId, 10);

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ ok: false, error: 'Message not found' });
    if (message.user_id !== userId) return res.status(403).json({ ok: false, error: 'Access denied' });

    const deleted = await Message.delete(messageId);
    if (deleted.affectedRows === 0) return res.status(500).json({ ok: false, error: 'Failed to delete' });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = { sendMessage, getMessages, updateMessage,deleteMessage };
