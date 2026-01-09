// services/assistant/streamController.js

const Message = require('../../model/Messages');
const Session = require('../../model/Sessions');
const { buildContext } = require('./contextBuilder');
const { streamReply } = require('./streamEngine');

async function streamAssistantReply(req, res, next) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }

    const session = await Session.findById(sessionId);
    if (!session || session.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.findBySession(sessionId);
    const lastUserMessage = messages[messages.length - 1];

    const context = buildContext({
      session,
      messages,
      newMessage: lastUserMessage
    });

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullText = '';

    for await (const chunk of streamReply(context)) {
      fullText += chunk;
      res.write(`data: ${chunk}\n\n`);
    }

    // persist final assistant message
    await Message.create({
      session_id: session.id,
      user_id: userId,
      sender: 'assistant',
      content: fullText
    });

    res.write(`event: done\ndata: [DONE]\n\n`);
    res.end();

  } catch (err) {
    next(err);
  }
}

module.exports = { streamAssistantReply };
