// services/assistant/streamEngine.js

async function* streamReply(context) {
  const response =
    "I hear what you’re saying. Let’s slow down and explore this together.";

  const tokens = response.split(" ");

  for (const token of tokens) {
    await new Promise(r => setTimeout(r, 60)); // simulate thinking
    yield token + " ";
  }
}

module.exports = { streamReply };
