"use client";

import React from "react";
import { FiSend } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  from: 'bot' | 'user';
  text: string;
  images?: string[];
};

const demoResponses: Message[] = [
  {
    from: 'bot',
    text: "Based on today's weather (sunny, 22°C) and your wardrobe, here's a perfect casual outfit for you!",
    images: ['/outfits/083b5947-291e-4f39-addf-f823019d22a0.jpg', '/outfits/23341bf6-c03a-410b-b6b8-e45468bcb73f.webp']
  },
  {
    from: 'bot',
    text: "For your meeting tomorrow, I'd suggest this professional yet comfortable look. It matches the cooler forecast!",
    images: ['/outfits/3577a4f2-85a1-4fb6-927d-eb812645eaa1.webp']
  },
  {
    from: 'bot',
    text: "Great choice! This business casual combo works well for the office. The navy and white pair nicely together.",
    images: ['/outfits/700437e7-ea90-426e-a344-4e2fd6a037ca.jpg', '/outfits/79c9112a-dc64-47e5-b777-da25425a148e.jpg']
  },
  {
    from: 'bot',
    text: "I noticed you haven't worn this in a while! It would be perfect for the weekend forecast - light rain expected.",
    images: ['/outfits/b7357618-a6cd-4c61-b117-2b0fce2d583b.jpg']
  },
];

export default function StyleChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    { from: 'bot', text: "Hi! I'm your AI style assistant. Ask me for outfit suggestions based on weather, occasions, or just tell me what you're in the mood for today!" }
  ]);
  const [input, setInput] = React.useState('');
  const [responseIndex, setResponseIndex] = React.useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      const response = demoResponses[responseIndex % demoResponses.length];
      setMessages(msgs => [...msgs, response]);
      setResponseIndex(i => i + 1);
    }, 700);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        StyleChat
      </h1>
      <div className="mt-8 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-lg rounded-2xl px-4 py-3 shadow-sm ${
                  msg.from === "user"
                    ? "rounded-br-none bg-gray-900 text-white"
                    : "rounded-bl-none border border-gray-200 bg-white text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                {msg.images && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {msg.images.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-white rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt="outfit suggestion"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-center gap-2"
        >
          <Input
            type="text"
            placeholder="What should I wear today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-full border-gray-300 bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <Button
            type="submit"
            className="rounded-full bg-gray-900 p-2 text-white hover:bg-gray-800"
          >
            <FiSend className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
