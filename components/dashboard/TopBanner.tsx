"use client";
import React, { useState } from "react";
import UpgradeToProModal from "./UpgradeToProModal";

export default function TopBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-center gap-3 bg-black px-4 py-3 text-center text-sm font-semibold text-white shadow-md rounded-lg">
        <span>Get unlimited AI outfit suggestions and weather-based recommendations!</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer rounded-md bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-200"
        >
          Upgrade to Pro
        </button>
      </div>
      <UpgradeToProModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}