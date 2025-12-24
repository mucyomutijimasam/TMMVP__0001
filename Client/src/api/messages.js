import api from "./axios";

export const fetchMessages = (sessionId) =>
  api.get(`/sessions/${sessionId}/messages`);

export const sendMessage = ({ sessionId, content }) => {
  // If sessionId is null → automatic session creation
  const url = sessionId
    ? `/sessions/${sessionId}/messages`
    : `/sessions/messages`;

  return api.post(url, { content });
};
