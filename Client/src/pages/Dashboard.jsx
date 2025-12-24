import { useEffect, useState } from "react";
import SessionList from "../Components/SessionList";
import MessageList from "../Components/MessageList";
import MessageInput from "../Components/MessageInput";
import { fetchMessages } from "../api/messages.js";
// 1. Import the Auth hook
import { useAuth } from "../hooks/userAuth";

export default function Dashboard() {
  // 2. Initialize Auth state
  const { user, logout } = useAuth();

  // 3. Initialize Chat state
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (activeSessionId) loadMessages(activeSessionId);
  }, [activeSessionId]);

  const loadMessages = async (sessionId) => {
    try {
      const res = await fetchMessages(sessionId);
      setMessages(res.data.data);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleMessageSent = (sessionId) => {
    setActiveSessionId(sessionId);
    loadMessages(sessionId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Area */}
      <div className="flex flex-col border-r bg-white w-64">
        {/* 4. User Profile Section */}
        <div className="p-4 border-b bg-gray-100">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-2 rounded transition"
          >
            Logout
          </button>
        </div>

        {/* 5. Session List Section */}
        <div className="flex-1 overflow-y-auto">
          <SessionList
            activeSessionId={activeSessionId}
            onSelect={setActiveSessionId}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {activeSessionId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList messages={messages} />
            </div>
            <div className="p-4 border-t bg-white">
              <MessageInput
                sessionId={activeSessionId}
                onSent={handleMessageSent}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-xl">Welcome, {user?.email.split('@')[0]}! 👋</p>
              <p>Select a session to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}