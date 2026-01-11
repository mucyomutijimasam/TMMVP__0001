// services/analysis/sessionAnalysis.js
const Message = require('../../model/Messages');
const { pool } = require('../../config/db');

/**
 * MOCK session analysis generator
 * Later replaced by LLM / ML logic
 */
async function generateSessionAnalysis(sessionId, userId) {
  const [existing] = await pool.execute(
    'SELECT id FROM session_analysis WHERE session_id = ?', 
    [sessionId]
  );
  if (existing.length > 0) return;
  // 1. Fetch messages
  const messages = await Message.findBySession(sessionId);

  if (!messages || messages.length === 0) {
    throw new Error('Cannot analyze empty session');
  }

  const userMessages = messages.filter(m => m.sender === 'user');

  const fullText = userMessages.map(m => m.content).join(' ');

  // ---- MOCK HEURISTICS (TEMPORARY) ----
  const length = fullText.length;

  let primaryEmotion = 'neutral';
  let distressScore = 3;
  let riskLevel = 'none';
  let recommendedAction = 'continue';

  if (fullText.match(/sad|tired|hopeless/i)) {
    primaryEmotion = 'sad';
    distressScore = 6;
  }

  if (fullText.match(/panic|anxious|afraid/i)) {
    primaryEmotion = 'anxious';
    distressScore = 7;
    recommendedAction = 'grounding';
  }

  if (fullText.match(/kill myself|end it all|no reason/i)) {
    riskLevel = 'critical';
    distressScore = 9;
    recommendedAction = 'escalate';
  }

  const analysis = {
    session_id: sessionId,
    user_id: userId,
    summary: `User discussed emotional concerns over ${userMessages.length} messages.`,
    primary_emotion: primaryEmotion,
    emotion_distribution: JSON.stringify({
      [primaryEmotion]: 0.7,
      neutral: 0.3
    }),
    sentiment_score: -0.3,
    distress_score: distressScore,
    risk_level: riskLevel,
    risk_flags: riskLevel !== 'none'
      ? JSON.stringify(['language_indicators'])
      : null,
    assistant_confidence: 65,
    recommended_action: recommendedAction
  };

  // 2. Persist analysis
  await pool.execute(
    `
    INSERT INTO session_analysis
    (
      session_id,
      user_id,
      summary,
      primary_emotion,
      emotion_distribution,
      sentiment_score,
      distress_score,
      risk_level,
      risk_flags,
      assistant_confidence,
      recommended_action
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      analysis.session_id,
      analysis.user_id,
      analysis.summary,
      analysis.primary_emotion,
      analysis.emotion_distribution,
      analysis.sentiment_score,
      analysis.distress_score,
      analysis.risk_level,
      analysis.risk_flags,
      analysis.assistant_confidence,
      analysis.recommended_action
    ]
  );

  return analysis;
}

module.exports = { generateSessionAnalysis };
