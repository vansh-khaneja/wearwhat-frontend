"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Share2, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { wardrobeService } from "@/lib/api/wardrobe";
import { stylingService, type StyleRecommendationResponse, type MatchedItem } from "@/lib/api/styling";
import { savedImagesService } from "@/lib/api";
import PostOutfitModal from "@/components/dashboard/PostOutfitModal";
import OutfitSelector from "@/components/dashboard/OutfitSelector";
import ShirtLoader from "@/components/ui/ShirtLoader";
import type { WardrobeItem } from "@/lib/api/types";

export default function StylingPage() {
  const [step, setStep] = useState<"select" | "result">("select");
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<StyleRecommendationResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  // Fetch wardrobe items
  const { data: wardrobeData, isLoading: isLoadingWardrobe } = useQuery({
    queryKey: ["wardrobe"],
    queryFn: async () => {
      const response = await wardrobeService.getItems();
      if (response.success) {
        return response.items;
      }
      throw new Error("Failed to load wardrobe items");
    },
  });

  const wardrobeItems = wardrobeData ?? [];

  const handleGetRecommendation = async () => {
    if (!selectedItem || isLoading) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await stylingService.getStyleRecommendation(selectedItem.id);
      setResult(response);
      setStep("result");
    } catch (err) {
      setError("Failed to get recommendation. Please try again.");
      console.error("Styling error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      await savedImagesService.saveImage({
        image_url: result.combined_image_url,
      });
    } catch (error) {
      console.error("Failed to save image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartOver = () => {
    setStep("select");
    setSelectedItem(null);
    setResult(null);
    setError("");
  };

  const getCategoryGroupLabel = (group: string) => {
    const labels: Record<string, string> = {
      upperWear: "Upper Wear",
      bottomWear: "Bottom Wear",
      outerWear: "Outer Wear",
      footwear: "Footwear",
      otherItems: "Accessories",
      accessories: "Accessories",
    };
    return labels[group] || group;
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 0.9) return "Perfect Match";
    if (score >= 0.8) return "Great Match";
    if (score >= 0.7) return "Good Match";
    return "Suggested";
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.9) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 0.8) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (score >= 0.7) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
  };

  return (
    <main className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            AI Styling
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {step === "select" && "Select an item from your wardrobe to get outfit suggestions"}
            {step === "result" && "Your personalized outfit recommendation"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span
            className={`px-3 py-1 rounded-full ${
              step === "select"
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            1. Select
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span
            className={`px-3 py-1 rounded-full ${
              step === "result"
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            2. Result
          </span>
        </div>
      </div>

      {/* Step 1: Select Item */}
      {step === "select" && (
        <div className="flex-1 flex flex-col min-h-0">
          {isLoadingWardrobe ? (
            <div className="flex-1 flex items-center justify-center">
              <ShirtLoader size="lg" />
            </div>
          ) : wardrobeItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">👕</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Your wardrobe is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Add items to your wardrobe first to start styling
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0">
                <OutfitSelector
                  items={wardrobeItems}
                  selectedItem={selectedItem}
                  onSelectionChange={setSelectedItem}
                  onGetSuggestions={handleGetRecommendation}
                  isLoading={isLoading}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/50 p-4 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 2: Results */}
      {step === "result" && result && (
        <div className="flex-1 overflow-y-auto pb-8">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={handleStartOver}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Start Over
          </Button>

          {/* Combined Image */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Your Styled Outfit
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowPostModal(true)}
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Post
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                >
                  {isSaving ? (
                    <ShirtLoader size="sm" />
                  ) : (
                    <Bookmark className="h-4 w-4 mr-1" />
                  )}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <img
                src={result.combined_image_url}
                alt="Combined outfit"
                className="w-full max-h-[400px] object-contain bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
          </div>

          {/* Source Item */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Your Selected Item
            </h3>
            <div className="inline-block overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border-2 border-gray-900 dark:border-gray-100">
              <div className="w-28 h-28 bg-gray-50 dark:bg-gray-700/50 p-3">
                <img
                  src={result.source_item.image_url}
                  alt={result.source_item.category}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {result.source_item.category}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getCategoryGroupLabel(result.source_item.categoryGroup)}
                </p>
              </div>
            </div>
          </div>

          {/* Matched Items */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Matched Items ({result.matched_items.filter(item => !item.is_source).length})
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {result.matched_items
                .filter((item) => !item.is_source)
                .map((item: MatchedItem) => (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-square bg-gray-50 dark:bg-gray-700/50 p-3 relative">
                      <img
                        src={item.image_url}
                        alt={item.category}
                        className="h-full w-full object-contain"
                      />
                      {/* Match score badge */}
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${getMatchScoreColor(item.match_score)}`}>
                        {Math.round(item.match_score * 100)}%
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {item.category}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getCategoryGroupLabel(item.categoryGroup)}
                      </p>
                      <span className={`mt-2 inline-block rounded-md px-2 py-1 text-xs ${getMatchScoreColor(item.match_score)}`}>
                        {getMatchScoreLabel(item.match_score)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Try Again Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="rounded-xl px-6 py-3"
            >
              Try Another Item
            </Button>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {result && (
        <PostOutfitModal
          open={showPostModal}
          onClose={() => setShowPostModal(false)}
          imageUrl={result.combined_image_url}
        />
      )}
    </main>
  );
}
