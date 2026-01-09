// services/assistant/safety.js

function requiresHumanIntervention(context) {
  const text = context.lastUserMessage.toLowerCase();

  const redFlags = [
    'kill myself',
    'end my life',
    'suicide',
    'hurt myself'
  ];

  return redFlags.some(flag => text.includes(flag));
}

module.exports = { requiresHumanIntervention };
