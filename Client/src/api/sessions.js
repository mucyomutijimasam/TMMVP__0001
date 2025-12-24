import api from "./axios";

export const fetchSessions = () =>
  api.get("/sessions");

export const createSession = () =>
  api.post("/sessions");

export const deleteSession = (sessionId) =>
  api.delete(`/sessions/${sessionId}`);
