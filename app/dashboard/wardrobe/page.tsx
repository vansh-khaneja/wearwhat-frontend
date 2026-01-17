"use client";

import React, { useState, useEffect, useCallback } from "react";
import NewOutfitModal from "@/components/dashboard/NewOutfitModal";
import EditImageModal from "@/components/dashboard/EditImageModal";
import { wardrobeService } from "@/lib/api/wardrobe";
import type { WardrobeItem } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WardrobePage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await wardrobeService.getItems();
      if (response.success) {
        setItems(response.items);
      }
    } catch (err) {
      setError("Failed to load wardrobe items");
      console.error("Error fetching wardrobe:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEditClick = (item: WardrobeItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleUploadClose = () => {
    setShowUploadModal(false);
    // Refresh items after upload
    fetchItems();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.category.toLowerCase().includes(query) ||
      item.categoryGroup.toLowerCase().includes(query) ||
      Object.values(item.attributes).some(
        (val) => val && val.toLowerCase().includes(query)
      )
    );
  });

  return (
    <main className="flex h-full flex-col overflow-hidden">
      <NewOutfitModal open={showUploadModal} onClose={handleUploadClose} />
      <EditImageModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
      />

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Wardrobe
      </h1>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-lg font-medium text-gray-600">
          {isLoading ? "Loading..." : `${filteredItems.length} Items`}
        </p>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <Button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
          >
            <span className="text-lg font-bold">+</span>
            <span>New Outfit</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="my-5">
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button onClick={fetchItems} variant="destructive">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="group relative">
                <Skeleton className="aspect-[3/5] w-full rounded-lg" />
                <Skeleton className="mt-2 h-4 w-3/4 rounded" />
                <Skeleton className="mt-1 h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && items.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-center text-gray-500">
          <div>
            <div className="mb-4 text-5xl">👕</div>
            <h3 className="mb-2 text-xl font-semibold">
              Your wardrobe is empty
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Upload your first outfit to get started
            </p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
            >
              + Add Items
            </Button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && !error && filteredItems.length > 0 && (
        <div className="mt-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative w-full cursor-pointer"
                onClick={() => handleEditClick(item)}
              >
                <div className="aspect-[3/5] w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.category}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    {item.category}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.lastWorn)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
