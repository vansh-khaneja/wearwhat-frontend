import React from "react";

export default function TopBanner() {
  return (
    <div className="mb-6 flex items-center justify-center gap-3 bg-black px-4 py-3 text-center text-sm font-semibold text-white shadow-md rounded-lg">
      <span>Get unlimited AI outfit suggestions and weather-based recommendations!</span>
      <button className="cursor-pointer rounded-md bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-200">
        Upgrade to Pro
      </button>
    </div>
  );
}