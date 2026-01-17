"use client";

import { useState } from "react";
import { X, Bookmark, Trash2 } from "lucide-react";
import type { WardrobeItem } from "@/lib/api/types";
import { ATTRIBUTE_LABELS } from "@/lib/api/types";
import { wardrobeService } from "@/lib/api/wardrobe";
import { savedImagesService } from "@/lib/api/savedImages";

interface EditImageModalProps {
  open: boolean;
  onClose: () => void;
  item: WardrobeItem | null;
  onDelete?: (itemId: string) => void;
}

export default function EditImageModal({ open, onClose, item, onDelete }: EditImageModalProps) {

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!open || !item) return null;

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      const response = await wardrobeService.deleteItem(item.id);
      if (response.success) {
        onDelete?.(item.id);
        onClose();
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {item.saved ? (
              <button
                onClick={async () => {
                  if (!item || !item.saved_image_id) return;
                  setIsSaving(true);
                  setSaveError("");
                  setSaveSuccess(false);
                  try {
                    await savedImagesService.delete(item.saved_image_id);
                    item.saved = false;
                    item.saved_image_id = undefined;
                    setSaveSuccess(false);
                  } catch (err) {
                    setSaveError("Failed to remove saved image");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  padding: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  color: "#22c55e",
                  transition: "color 0.2s",
                  opacity: isSaving ? 0.6 : 1,
                }}
                disabled={isSaving}
                title="Remove from saved"
              >
                <Bookmark size={20} fill="#22c55e" />
                {isSaving && (
                  <span style={{ marginLeft: 8, fontSize: 12 }}>Removing...</span>
                )}
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (!item) return;
                  setIsSaving(true);
                  setSaveError("");
                  setSaveSuccess(false);
                  try {
                    await savedImagesService.saveImage({ image_id: item.id });
                    item.saved = true;
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 1500);
                  } catch (err) {
                    setSaveError("Failed to save image");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  padding: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  color: saveSuccess ? "#22c55e" : "#666",
                  transition: "color 0.2s",
                  opacity: isSaving ? 0.6 : 1,
                }}
                disabled={isSaving}
                onMouseEnter={(e) => (e.currentTarget.style.color = saveSuccess ? "#22c55e" : "#0095da")}
                onMouseLeave={(e) => (e.currentTarget.style.color = saveSuccess ? "#22c55e" : "#666")}
                title={saveSuccess ? "Saved!" : "Save to outfits"}
              >
                <Bookmark size={20} />
                {isSaving && (
                  <span style={{ marginLeft: 8, fontSize: 12 }}>Saving...</span>
                )}
                {saveSuccess && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: "#22c55e" }}>Saved!</span>
                )}
              </button>
            )}
            {saveError && (
              <span style={{ color: "#dc2626", fontSize: 12, marginLeft: 8 }}>{saveError}</span>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                color: "#666",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              title="Delete item"
            >
              <Trash2 size={20} />
            </button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600, color: "#222" }}>
              Delete Item
            </h4>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#666" }}>
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "#333",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "#dc2626",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  color: "#fff",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
