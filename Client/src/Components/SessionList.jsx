import { useEffect, useState } from "react";
import { fetchSessions, createSession } from "../api/sessions.js";

export default function SessionList({ activeSessionId, onSelect }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const res = await fetchSessions();
    setSessions(res.data.data);
  };

  const newSession = async () => {
    const res = await createSession();
    onSelect(res.data.data.id);
    loadSessions();
  };

  return (
    <div className="w-64 border-r p-4">
      <button
        onClick={newSession}
        className="w-full mb-4 bg-black text-white p-2 rounded"
      >
        + New Session
      </button>

      <ul className="space-y-2">
        {sessions.map(s => (
          <li
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`p-2 rounded cursor-pointer ${
              s.id === activeSessionId
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            Session #{s.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
