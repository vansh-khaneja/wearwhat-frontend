"use client";
import React from "react";
import WardrobePage from "./wardrobe/page";
import StylingPage from "./styling/page";
import PlanningPage from "./planning/page";
import CommunityPage from "./community/page";
import StyleChatPage from "./stylechat/page";
import SavedPage from "./saved/page";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}
