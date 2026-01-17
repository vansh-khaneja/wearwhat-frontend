"use client";
import React from "react";
import { FiScissors } from "react-icons/fi";

export default function StylingPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4">
        <FiScissors size={64} className="text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-800">AI Styling Coming Soon</h2>
        <p className="max-w-md text-gray-500">
          Get personalized outfit recommendations based on today's weather, your schedule, and personal style. Our AI will suggest the perfect outfit from your digitized wardrobe every morning.
        </p>
      </div>
    </div>
  );
}
