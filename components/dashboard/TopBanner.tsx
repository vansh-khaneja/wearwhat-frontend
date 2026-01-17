import React from "react";

export default function TopBanner() {
  return (
    <div className="fixed left-[200px] top-0 z-0 flex w-[calc(100vw-200px)] items-center justify-center gap-3 bg-black px-4 py-2 text-center text-sm font-semibold text-white shadow-md">
      <span>Unlock access to all features!</span>
      <button className="cursor-pointer rounded-md bg-white px-3.5 py-1 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-200">
        Choose a plan
      </button>
    </div>
  );
}
