// services/assistant/engine.js

async function generateReply(context) {
  // TEMP implementation (rule-based placeholder)
  // This will later be replaced by LLM call

  const lastUserMessage = context.lastUserMessage;

  let reply = "I hear you. Can you tell me more about that?";

  if (lastUserMessage.length > 200) {
    reply = "That sounds important. Let’s break it down together.";
  }

  return {
    text: reply,
    confidence: 0.6,
    requiresFollowUp: true
  };
}

module.exports = { generateReply };
