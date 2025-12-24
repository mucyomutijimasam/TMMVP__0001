export default function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3"> 
      {messages.map(m => (
        <div
          key={m.id}
          className={`max-w-xl p-3 rounded ${
            m.sender === "user"
              ? "ml-auto bg-black text-white"
              : "mr-auto bg-gray-200"
          }`}
        >
          {m.content}
       </div>
      ))}
    </div>
  );
}
