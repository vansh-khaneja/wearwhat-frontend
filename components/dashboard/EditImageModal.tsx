"use client";

import { X } from "lucide-react";
import type { WardrobeItem } from "@/lib/api/types";
import { ATTRIBUTE_LABELS } from "@/lib/api/types";

interface EditImageModalProps {
  open: boolean;
  onClose: () => void;
  item: WardrobeItem | null;
}

export default function EditImageModal({ open, onClose, item }: EditImageModalProps) {
  if (!open || !item) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryGroupLabel = (group: string) => {
    const labels: Record<string, string> = {
      upperWear: "Upper Wear",
      bottomWear: "Bottom Wear",
      outerWear: "Outer Wear",
      footwear: "Footwear",
      otherItems: "Accessories",
    };
    return labels[group] || group;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#222" }}>
            Item Details
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              color: "#666",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            gap: 24,
            padding: 24,
            overflow: "auto",
          }}
        >
          {/* Image */}
          <div
            style={{
              flex: "0 0 280px",
              background: "#f7f7f7",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              aspectRatio: "3/4",
            }}
          >
            <img
              src={item.image_url}
              alt={item.category}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>

          {/* Tags/Attributes */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  fontWeight: 500,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Category
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "#0095da",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {item.category}
                </span>
                <span
                  style={{
                    background: "#e8f4fc",
                    color: "#0095da",
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {getCategoryGroupLabel(item.categoryGroup)}
                </span>
              </div>
            </div>

            {/* Attributes */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  fontWeight: 500,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Attributes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(item.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: "#666",
                        minWidth: 100,
                      }}
                    >
                      {ATTRIBUTE_LABELS[key] || key}:
                    </span>
                    <span
                      style={{
                        background: "#f0f0f0",
                        color: "#333",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Added */}
            {item.created_at && (
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#888",
                    fontWeight: 500,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Added
                </div>
                <span style={{ fontSize: 13, color: "#444" }}>
                  {formatDate(item.created_at)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
