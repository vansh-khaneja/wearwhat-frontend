"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { X, Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stylingService, type StylingRecommendationResponse } from "@/lib/api/styling";
import { calendarOutfitsService, type CalendarOutfit } from "@/lib/api/calendarOutfits";
import { cn } from "@/lib/utils";

interface DayData {
  day: string;
  date: string;
  fullDate: string; // Format: YYYY-MM-DD for API
  temp: string;
  tempValue: number;
  icon: string;
  today?: boolean;
}

// Generate week data with proper dates
function generateWeekData(): DayData[] {
  const today = new Date();
  const days: DayData[] = [];

  // Start from 2 days ago
  for (let i = -2; i <= 4; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const isToday = i === 0;
    const dayName = isToday ? "Today" : dayNames[date.getDay()];
    const dateStr = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    const fullDate = date.toISOString().split('T')[0];

    // Mock weather data
    const temps = [20, 21, 22, 23, 24, 22, 19];
    const lows = [10, 9, 10, 11, 12, 10, 8];
    const icons = ["sunny", "sunny", "sunny", "sunny", "cloudy", "rainy", "sunny"];

    days.push({
      day: dayName,
      date: dateStr,
      fullDate,
      temp: `${temps[i + 2]}° / ${lows[i + 2]}°`,
      tempValue: temps[i + 2],
      icon: icons[i + 2],
      today: isToday,
    });
  }

  return days;
}

const week = generateWeekData();

function getWeatherIcon(icon: string, size: number = 20) {
  if (icon === "sunny") return <span style={{ fontSize: size }}>☀️</span>;
  if (icon === "cloudy") return <span style={{ fontSize: size }}>⛅️</span>;
  if (icon === "rainy") return <span style={{ fontSize: size }}>🌧️</span>;
  return null;
}

export default function PlanningPage() {
  const [carouselIdx, setCarouselIdx] = useState(2);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<StylingRecommendationResponse | null>(null);
  const [error, setError] = useState("");
  const [savedOutfits, setSavedOutfits] = useState<Record<string, CalendarOutfit>>({});
  const [loadingSavedOutfits, setLoadingSavedOutfits] = useState(true);

  const idx = Math.max(1, Math.min(carouselIdx, week.length - 2));
  const visible = week.slice(idx - 1, idx + 2);

  // Load saved outfits on mount
  const fetchSavedOutfits = useCallback(async () => {
    try {
      setLoadingSavedOutfits(true);
      const outfits = await calendarOutfitsService.getAll();
      const outfitsMap: Record<string, CalendarOutfit> = {};
      outfits.forEach((outfit) => {
        outfitsMap[outfit.outfit_date] = outfit;
      });
      setSavedOutfits(outfitsMap);
    } catch (err) {
      console.error("Failed to load saved outfits:", err);
    } finally {
      setLoadingSavedOutfits(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedOutfits();
  }, [fetchSavedOutfits]);
  
  // ... (keep the rest of the component logic the same)

  const handleCardClick = (day: DayData) => {
    setSelectedDay(day);
    setError("");

    // Check if there's a saved outfit for this date
    const savedOutfit = savedOutfits[day.fullDate];
    if (savedOutfit) {
      setPrompt(savedOutfit.prompt);
      setResult({
        success: true,
        prompt: savedOutfit.prompt,
        selected_categories: savedOutfit.selected_categories,
        combined_image_url: savedOutfit.combined_image_url,
        items: savedOutfit.items,
      });
    } else {
      setPrompt("");
      setResult(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
    setPrompt("");
    setResult(null);
    setError("");
    setIsLoading(false);
  };

  const handleGenerateOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await stylingService.getRecommendation(prompt.trim());
      setResult(response);
    } catch (err) {
      setError("Failed to generate outfit. Please try again.");
      console.error("Styling error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOutfit = async () => {
    if (!selectedDay || !result || isSaving) return;

    setIsSaving(true);
    setError("");

    try {
      await calendarOutfitsService.save({
        outfit_date: selectedDay.fullDate,
        combined_image_url: result.combined_image_url,
        prompt: prompt,
        temperature: selectedDay.tempValue,
        selected_categories: result.selected_categories,
        items: result.items,
      });

      // Update local state
      setSavedOutfits((prev) => ({
        ...prev,
        [selectedDay.fullDate]: {
          outfit_date: selectedDay.fullDate,
          combined_image_url: result.combined_image_url,
          prompt: prompt,
          temperature: selectedDay.tempValue,
          selected_categories: result.selected_categories,
          items: result.items,
        },
      }));

      handleCloseModal();
    } catch (err) {
      setError("Failed to save outfit. Please try again.");
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOutfit = async () => {
    if (!selectedDay || isDeleting) return;

    setIsDeleting(true);
    setError("");

    try {
      await calendarOutfitsService.delete(selectedDay.fullDate);

      // Update local state
      setSavedOutfits((prev) => {
        const updated = { ...prev };
        delete updated[selectedDay.fullDate];
        return updated;
      });

      setResult(null);
      setPrompt("");
    } catch (err) {
      setError("Failed to delete outfit. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasSavedOutfit = selectedDay ? !!savedOutfits[selectedDay.fullDate] : false;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Outfit Calendar
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Plan your outfits for the week with AI-powered suggestions based on weather.
      </p>
      <div className="relative mt-8 flex flex-1 items-center justify-center">
        {/* Left arrow */}
        <Button
          onClick={() => setCarouselIdx((idx) => Math.max(idx - 1, 1))}
          disabled={carouselIdx <= 1}
          aria-label="Previous day"
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full"
        >
          <FiChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex w-full items-center justify-center gap-x-8">
          {visible.map((d, i) => {
            const isCenter = i === 1;
            const savedOutfit = savedOutfits[d.fullDate];
            return (
              <div key={d.day + d.date} className={cn("flex flex-col items-center justify-center transition-all duration-300 ease-in-out", isCenter ? "z-10 scale-100" : "z-0 scale-90 opacity-70")}>
                <div className="mb-3 flex flex-col items-center">
                  <div
                    className={cn("relative text-center font-semibold", isCenter ? "text-lg" : "text-base", d.today ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400")}
                  >
                    {d.today && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-gray-900 dark:text-gray-100">
                        •
                      </span>
                    )}
                    {d.day}
                  </div>
                  <div
                    className={cn("mt-1 text-xs", isCenter ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500")}
                  >
                    {d.date}
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {getWeatherIcon(d.icon)}
                    <span
                      className={cn("text-xs", isCenter ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500")}
                    >
                      {d.temp}
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => handleCardClick(d)}
                  className={cn("flex h-96 w-72 cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out hover:border-gray-400 dark:hover:border-gray-500", isCenter ? "shadow-xl dark:shadow-2xl" : "shadow-sm dark:shadow-md", savedOutfit ? "border-gray-300 dark:border-gray-600" : "border-dashed border-gray-200 dark:border-gray-700")}
                >
                  {loadingSavedOutfits ? (
                    <Loader2 className="h-8 w-8 animate-spin text-gray-300 dark:text-gray-600" />
                  ) : savedOutfit ? (
                    <img
                      src={savedOutfit.combined_image_url}
                      alt={`Outfit for ${d.date}`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <FiCalendar
                      size={isCenter ? 56 : 48}
                      className="text-gray-300 dark:text-gray-600"
                    />
                  )}
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
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full"
        >
          <FiChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Modal */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(selectedDay.icon, 28)}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedDay.today ? "Today" : selectedDay.day}, {selectedDay.date}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedDay.temp}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasSavedOutfit && (
                  <Button
                    onClick={handleDeleteOutfit}
                    disabled={isDeleting}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/50 dark:hover:text-red-400 disabled:opacity-50"
                    title="Delete outfit"
                  >
                    {isDeleting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </Button>
                )}
                <Button
                  onClick={handleCloseModal}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
              {/* Prompt Input */}
              <form onSubmit={handleGenerateOutfit} className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  What&apos;s your plan for this day?
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="e.g., office meeting, casual brunch, date night..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading}
                      className="h-12 px-4 text-base rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="h-12 px-5 rounded-xl"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </form>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/50 p-4 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Image Space */}
              <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
                {isLoading ? (
                  <div className="flex h-80 flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                      <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-gray-900 dark:border-gray-100 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Generating your outfit...</p>
                  </div>
                ) : result ? (
                  <div>
                    <img
                      src={result.combined_image_url}
                      alt="Generated outfit"
                      className="w-full h-auto max-h-96 object-contain bg-white dark:bg-gray-800"
                    />
                    {/* Selected Categories */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Selected Items
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.selected_categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-gray-900 dark:bg-gray-100 px-3 py-1 text-xs font-medium text-white dark:text-gray-900"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-80 flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500">
                    <FiCalendar size={48} />
                    <p className="text-sm">Your outfit will appear here</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {result && (
                <div className="mt-4 flex justify-center gap-3">
                  <Button
                    onClick={() => {
                      setResult(null);
                      setPrompt("");
                    }}
                    variant="outline"
                    className="rounded-xl px-6 py-2"
                  >
                    Try Another Outfit
                  </Button>
                  {!hasSavedOutfit && (
                    <Button
                      onClick={handleSaveOutfit}
                      disabled={isSaving}
                      className="rounded-xl px-6 py-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save to Calendar"
                      )}
                    </Button>
                  )}
                  {hasSavedOutfit && (
                    <Button
                      onClick={handleSaveOutfit}
                      disabled={isSaving}
                      className="rounded-xl px-6 py-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Outfit"
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
