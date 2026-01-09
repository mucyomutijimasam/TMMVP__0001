// services/assistant/contextBuilder.js

function buildContext({ session, messages, newMessage }) {
  return {
    sessionId: session.id,
    userId: session.user_id,
    history: messages.slice(-10), // last 10 messages only
    lastUserMessage: newMessage.content,
    metadata: {
      messageCount: messages.length,
      sessionStatus: session.status
    }
  };
}

module.exports = { buildContext };
