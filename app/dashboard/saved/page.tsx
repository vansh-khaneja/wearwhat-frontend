"use client";
import React from "react";
import { Bookmark, SquarePen } from "lucide-react";

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
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {outfitImages.map((img) => (
            <div
              key={img}
              className="group relative w-full cursor-pointer"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-white relative">
                <img
                  src={`/outfits/${img}`}
                  alt="saved outfit"
                  className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <SquarePen className="w-5 h-5" />
                    <span className="text-sm font-medium">Edit</span>
                  </div>
                </div>
                {/* Save icon in top right */}
                <div className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Bookmark className="w-5 h-5" fill="white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
