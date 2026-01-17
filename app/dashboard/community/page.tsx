"use client";
import React from "react";
import { LuUsers } from "react-icons/lu";

export default function CommunityPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4">
        <LuUsers size={64} className="text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-800">Community Coming Soon</h2>
        <p className="max-w-md text-gray-500">
          We're building a vibrant space for fashion lovers to connect, share, and inspire each other. Stay tuned for exciting community features!
        </p>
      </div>
    </div>
  );
}
