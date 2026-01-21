"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { savedImagesService } from "@/lib/api";
import type { SavedImage } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import ShirtLoader from "@/components/ui/ShirtLoader";

export default function SavedPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["savedImages"],
    queryFn: async () => {
      const data = await savedImagesService.getAll();
      return Array.isArray(data) ? data : [];
    },
  });

  const savedImages = data ?? [];

  const handleRemoveSaved = async (e: React.MouseEvent, imgId: string) => {
    e.stopPropagation();
    try {
      await savedImagesService.delete(imgId);
      queryClient.setQueryData<SavedImage[]>(["savedImages"], (oldData) =>
        oldData ? oldData.filter((s) => s.id !== imgId) : []
      );
    } catch {
      alert("Failed to remove saved image");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Saved Outfits
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Your collection of favorite outfits and style inspirations.
      </p>
      <div className="mt-8 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[20vh] pt-20">
            <ShirtLoader size="lg" />
          </div>
        ) : error ? (
          <Alert variant="destructive">{error instanceof Error ? error.message : "Failed to load saved images"}</Alert>
        ) : savedImages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <div>
              <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No saved outfits</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by saving outfits you like.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {savedImages.map((img) => (
              <div
                key={img.id}
                className="group relative w-full"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
                  <img
                    src={img.image_url || (img.image_id.startsWith("http") ? img.image_id : `/outfits/${img.image_id}`)}
                    alt="saved outfit"
                    className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    onError={e => { e.currentTarget.src = '/placeholder.png'; }}
                  />
                  {/* Remove button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from saved"
                    onClick={(e) => handleRemoveSaved(e, img.id)}
                  >
                    <Bookmark className="w-5 h-5" fill="white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
