"use client";
import React from "react";
import { FiCalendar } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const week = [
  { day: "Tue", date: "Jan 13", temp: "20° 10°", icon: "sunny" },
  { day: "Wed", date: "Jan 14", temp: "20° 9°", icon: "sunny" },
  { day: "Today", date: "Jan 15", temp: "21° 10°", icon: "sunny", today: true },
  { day: "Fri", date: "Jan 16", temp: "23° 11°", icon: "sunny" },
  { day: "Sat", date: "Jan 17", temp: "24° 12°", icon: "cloudy" },
  { day: "Sun", date: "Jan 18", temp: "22° 10°", icon: "rainy" },
  { day: "Mon", date: "Jan 19", temp: "19° 8°", icon: "sunny" },
];

function getWeatherIcon(icon: string) {
  if (icon === "sunny") return <span style={{fontSize: 20}}>☀️</span>;
  if (icon === "cloudy") return <span style={{fontSize: 20}}>⛅️</span>;
  if (icon === "rainy") return <span style={{fontSize: 20}}>🌧️</span>;
  return null;
}

export default function PlanningPage() {
  const [carouselIdx, setCarouselIdx] = React.useState(2); // Center on 'Today'
  const idx = Math.max(1, Math.min(carouselIdx, week.length - 2));
  const visible = week.slice(idx - 1, idx + 2);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Outfit Calendar
      </h1>
      <div className="relative mt-8 flex flex-1 items-center justify-center">
        {/* Left arrow */}
        <Button
          onClick={() => setCarouselIdx((idx) => Math.max(idx - 1, 1))}
          disabled={carouselIdx <= 1}
          aria-label="Previous day"
          className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div className="flex w-full items-center justify-center gap-x-8">
          {visible.map((d, i) => {
            const isCenter = i === 1;
            const cardClasses = `
              flex flex-col items-center justify-center transition-all duration-300 ease-in-out
              ${isCenter ? "z-10 scale-100" : "z-0 scale-90 opacity-80"}
            `;
            return (
              <div key={d.day + d.date} className={cardClasses}>
                <div className="mb-2 flex flex-col items-center">
                  <div
                    className={`relative text-center font-semibold ${
                      isCenter ? "text-lg" : "text-base"
                    } ${d.today ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {d.today && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-gray-900">
                        •
                      </span>
                    )}
                    {d.day}
                  </div>
                  <div
                    className={`mt-1 text-xs ${
                      isCenter ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {d.date}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {getWeatherIcon(d.icon)}
                    <span
                      className={`text-xs ${
                        isCenter ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {d.temp}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-96 w-72 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out ${
                    isCenter ? "shadow-xl" : "shadow-sm"
                  }`}
                >
                  <FiCalendar
                    size={isCenter ? 64 : 56}
                    className="text-gray-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Right arrow */}
        <Button
          onClick={() =>
            setCarouselIdx((idx) => Math.min(idx + 1, week.length - 2))
          }
          disabled={carouselIdx >= week.length - 2}
          aria-label="Next day"
          className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
