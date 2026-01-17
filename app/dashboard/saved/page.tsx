"use client";
import React from "react";
import { FiBookmark } from "react-icons/fi";

const outfitImages = [
  "083b5947-291e-4f39-addf-f823019d22a0.jpg",
  "09d3c6eb-7b2e-4d95-ad0c-8c0a97a00723.webp",
  "1ff5d1c5-054d-4262-8a0a-7128ceb33d64.webp",
  "23341bf6-c03a-410b-b6b8-e45468bcb73f.webp",
];

export default function SavedPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Saved Outfits
      </h1>
      <div className="mt-8 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {outfitImages.map((img) => (
            <div
              key={img}
              className="group relative w-full cursor-pointer"
            >
              <div className="aspect-[3/5] w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={`/outfits/${img}`}
                  alt="saved outfit"
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                <FiBookmark className="h-8 w-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
