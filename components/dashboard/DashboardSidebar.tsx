"use client";

import React from "react";

const sidebarOptions = [
  { label: "Wardrobe", icon: "👚" },
  { label: "Styling", icon: "🎨" },
  { label: "Planner", icon: "🗓️" },
  { label: "Community", icon: "🌐" },
  { label: "AI Stylist", icon: "🤖" },
];

export function DashboardSidebar() {
  return (
    <aside
      className="w-56 min-h-screen flex flex-col py-8 px-4 bg-gray-800 text-white"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 200 }}
    >
      <div className="flex items-center gap-2 px-4 mb-8">
        <span className="text-2xl">👚</span>
        <h1 className="text-xl font-bold">WearWhat</h1>
      </div>
      <nav className="flex flex-col gap-4">
        {sidebarOptions.map((option) => (
          <button
            key={option.label}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
          >
            <span className="text-xl">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
