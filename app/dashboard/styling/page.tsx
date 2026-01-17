"use client";
import React from "react";
import { FiScissors } from "react-icons/fi";

export default function StylingPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4">
        <FiScissors size={64} className="text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-800">Styling Coming Soon</h2>
        <p className="max-w-md text-gray-500">
          Soon you'll be able to get personalized outfit styling and recommendations. Stay tuned for new features!
        </p>
      </div>
    </div>
  );
}
