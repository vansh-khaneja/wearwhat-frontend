"use client";

import React, { useEffect, useState } from "react";
import { Bookmark, SquarePen } from "lucide-react";
import { savedImagesService } from "@/lib/api";
import type { SavedImage } from "@/lib/api/types";


export default function SavedPage() {
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState("");

  useEffect(() => {
    const fetchSavedImages = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await savedImagesService.getAll();
        setSavedImages(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load saved images");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedImages();
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Saved Outfits
      </h1>
      <div className="mt-8 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : savedImages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No saved outfits yet.</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {savedImages.map((img) => (
              <div
                key={img.id}
                className="group relative w-full cursor-pointer"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-white relative">
                  <img
                    src={img.image_url || (img.image_id.startsWith("http") ? img.image_id : `/outfits/${img.image_id}`)}
                    alt="saved outfit"
                    className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    onError={e => { e.currentTarget.src = '/placeholder.png'; }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white w-full justify-center">
                      {img.note ? (
                        <span className="text-sm font-medium truncate max-w-[160px]" title={img.note}>{img.note}</span>
                      ) : editingNoteId === img.id ? (
                        <form
                          className="flex items-center gap-2 w-full justify-center"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setNoteLoading(true);
                            setNoteError("");
                            try {
                              await savedImagesService.updateNote({ saved_image_id: img.id, note: noteInput });
                              setSavedImages((prev) => prev.map((s) => s.id === img.id ? { ...s, note: noteInput } : s));
                              setEditingNoteId(null);
                              setNoteInput("");
                            } catch (err) {
                              setNoteError("Failed to save note");
                            } finally {
                              setNoteLoading(false);
                            }
                          }}
                        >
                          <input
                            className="rounded px-2 py-1 text-black text-xs max-w-[120px]"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Add note..."
                            autoFocus
                            maxLength={100}
                            disabled={noteLoading}
                          />
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                            disabled={noteLoading || !noteInput.trim()}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="ml-1 text-xs text-gray-300 hover:text-white"
                            onClick={() => { setEditingNoteId(null); setNoteInput(""); }}
                            disabled={noteLoading}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          className="flex items-center gap-2 text-white bg-transparent border-none outline-none"
                          onClick={() => { setEditingNoteId(img.id); setNoteInput(""); }}
                          tabIndex={0}
                        >
                          <SquarePen className="w-5 h-5" />
                          <span className="text-sm font-medium">Add Note</span>
                        </button>
                      )}
                    </div>
                    {noteError && editingNoteId === img.id && (
                      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-red-400">{noteError}</div>
                    )}
                  </div>
                  {/* Save icon in top right */}
                  <button
                    className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-transparent border-none outline-none"
                    title="Remove from saved"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await savedImagesService.delete(img.id);
                        setSavedImages((prev) => prev.filter((s) => s.id !== img.id));
                      } catch {
                        alert("Failed to remove saved image");
                      }
                    }}
                  >
                    <Bookmark className="w-5 h-5" fill="white" />
                  </button>
                </div>
                {/* Note is now only shown in the overlay above, not below the image */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
