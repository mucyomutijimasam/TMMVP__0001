// services/assistant/orchestrator.js

const { buildContext } = require('./contextBuilder');
const { generateReply } = require('./engine');
const { requiresHumanIntervention } = require('./safety');

const Message = require('../../model/Messages');

async function handleNewMessage({ session, messages, newMessage }) {
  const context = buildContext({ session, messages, newMessage });

  if (requiresHumanIntervention(context)) {
    // Future: notify professionals / flag session
    return null;
  }

  const assistantReply = await generateReply(context);

  // Persist assistant message
  await Message.create({
    session_id: session.id,
    user_id: session.user_id,
    sender: 'assistant',
    content: assistantReply.text,
    emotion_detected: null
  });

  return assistantReply;
}

module.exports = { handleNewMessage };
