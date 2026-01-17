"use client";

import React, { useState, useEffect, useCallback } from "react";
import NewOutfitModal from "@/components/dashboard/NewOutfitModal";
import EditImageModal from "@/components/dashboard/EditImageModal";
import { wardrobeService } from "@/lib/api/wardrobe";
import type { WardrobeItem } from "@/lib/api/types";

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
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <NewOutfitModal open={showUploadModal} onClose={handleUploadClose} />
      <EditImageModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
      />

      <h2 style={{ fontWeight: 700, fontSize: 28, margin: "0 0 32px 8px", color: "#222", letterSpacing: -1, flexShrink: 0 }}>
        Wardrobe
      </h2>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 32px 0 0", gap: 18, flexShrink: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 18, color: "#555", marginLeft: 8 }}>
          {isLoading ? "Loading..." : `${filteredItems.length} Items`}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e3eaf2",
              fontSize: 15,
              outline: "none",
              width: 220,
              background: "#fff",
              color: "#444",
              boxShadow: "0 1px 3px rgba(0,149,218,0.03)",
            }}
          />
          <button
            style={{
              background: "#0095da",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              border: "none",
              borderRadius: 6,
              padding: "5px 12px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,149,218,0.07)",
              transition: "background 0.15s, color 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setShowUploadModal(true)}
          >
            <span style={{ fontSize: 15, fontWeight: 700 }}>+</span>
            <span style={{ fontSize: 13 }}>New Outfit</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={{ margin: "20px 8px", padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#dc2626" }}>
          {error}
          <button
            onClick={fetchItems}
            style={{ marginLeft: 12, background: "#dc2626", color: "#fff", border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e3eaf2", borderTopColor: "#0095da", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            Loading your wardrobe...
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && items.length === 0 && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👕</div>
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Your wardrobe is empty</div>
            <div style={{ fontSize: 14, color: "#aaa", marginBottom: 20 }}>Upload your first outfit to get started</div>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                background: "#0095da",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              + Add Items
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && !error && filteredItems.length > 0 && (
        <div style={{ flex: 1, overflowY: "auto", marginTop: 12, marginRight: -32, paddingRight: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 24, paddingBottom: 24 }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/5",
                  height: 220,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => handleEditClick(item)}
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector(".img-overlay") as HTMLElement | null;
                  if (overlay) overlay.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector(".img-overlay") as HTMLElement | null;
                  if (overlay) overlay.style.opacity = "0";
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f7f7f7",
                    padding: 12,
                    boxSizing: "border-box",
                    borderRadius: 0,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={item.category}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: 0,
                      background: "transparent",
                      display: "block",
                    }}
                  />
                  {/* Overlay for hover */}
                  <div
                    className="img-overlay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.55)",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 500,
                        textDecoration: "underline",
                        letterSpacing: 0.1,
                        background: "transparent",
                        padding: "0 10px",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 6,
                      }}
                    >
                      <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 2 }}>
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                      Edit
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        bottom: 10,
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 11,
                        fontWeight: 400,
                        letterSpacing: 0.1,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
