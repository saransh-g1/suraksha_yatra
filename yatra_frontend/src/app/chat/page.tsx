"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I can help collect your trip details. What's your destination?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input.trim() } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = String(data?.messages?.at(-1)?.content || "Sorry, I couldn't understand that.");
      setMessages([...next, { role: "assistant", content: reply }]);
      
      // If trip data is collected, show it
      if (data.data) {
        console.log("Trip data collected:", data.data);
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `✅ Trip details collected! ${JSON.stringify(data.data, null, 2)}` 
        }]);
      }
    } catch (e: any) {
      setMessages([...next, { role: "assistant", content: "Error: Make sure the FastAPI service is running on localhost:8000" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 bg-white">
      <h1 className="text-xl font-semibold mb-4 text-orange-600">Trip Chat (FastAPI)</h1>
      <div className="border rounded-lg p-4 h-[60vh] overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={
              m.role === "user"
                ? "inline-block bg-orange-600 text-white px-3 py-2 rounded-lg"
                : "inline-block bg-orange-50 text-gray-900 px-3 py-2 rounded-lg"
            }>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      {/* <p className="text-sm text-gray-500 mt-2">
        Make sure the FastAPI service is running on localhost:8000
      </p> */}
    </div>
  );
}
