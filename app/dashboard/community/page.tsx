"use client";
import React from "react";
import { LuUsers } from "react-icons/lu";

export default function CommunityPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4">
        <LuUsers size={64} className="text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-800">Style Community Coming Soon</h2>
        <p className="max-w-md text-gray-500">
          Share your favorite outfits, discover trending styles, and get inspiration from others. Connect with fashion enthusiasts who share your taste and learn new ways to style your wardrobe.
        </p>
      </div>
    </div>
  );
}
