import { useState } from "react";
import { sendMessage } from "../api/messages.js";

export default function MessageInput({ sessionId, onSent }) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    const res = await sendMessage({ sessionId, content });
    setContent("");
    setSending(false);

    // If session was auto-created, backend should return sessionId
    if (res.data.sessionId) {
      onSent(res.data.sessionId);
    } else {
      onSent(sessionId);
    }
  };

  return (
    <form onSubmit={submit} className="border-t p-4 flex gap-2">
      <input
        value={content}
        onChange={e => setContent(e.target.value)}
        className="flex-1 border p-2 rounded"
        placeholder="Type your message…"
      />
      <button
        disabled={sending}
        className="bg-black text-white px-4 rounded"
      >
        Send
      </button>
    </form>
  );
}
