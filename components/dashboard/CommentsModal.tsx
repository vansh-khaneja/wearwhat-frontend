"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Send, Trash2 } from "lucide-react";
import { FiHeart } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postsService, type Post, type Comment } from "@/lib/api/posts";

interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  onLike: (postId: string) => void;
  currentUserId?: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CommentsModal({ open, onClose, post, onLike, currentUserId }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiking, setIsLiking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchComments();
      setLikesCount(post.likes_count);
    }
  }, [open, post.id, post.likes_count]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await postsService.getComments(post.id);
      if (response.success) {
        setComments(response.comments);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const response = await postsService.addComment(post.id, newComment.trim());
      if (response.success) {
        setComments((prev) => [...prev, response.comment]);
        setNewComment("");
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Post comment error:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      const response = await postsService.deleteComment(commentId);
      if (response.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error("Delete comment error:", err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await postsService.like(post.id);
      if (response.success) {
        setLikesCount(response.likes_count);
        onLike(post.id);
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setIsLiking(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-5xl h-[85vh] max-h-[700px] bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Post Image */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-auto">
          <img
            src={post.image_url}
            alt="Post"
          />
        </div>

        {/* Right side - Comments */}
        <div className="w-[400px] flex flex-col border-l border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <Avatar className="w-10 h-10">
              {post.user_profile_image && (
                <AvatarImage src={post.user_profile_image} alt={post.user_name} />
              )}
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {getInitials(post.user_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {post.user_name}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Post text + Comments list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Original post text */}
            {post.text && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {post.user_profile_image && (
                    <AvatarImage src={post.user_profile_image} alt={post.user_name} />
                  )}
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                    {getInitials(post.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 mr-2">
                      {post.user_name}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {post.text}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Divider */}
            {post.text && comments.length > 0 && (
              <hr className="border-gray-200 dark:border-gray-700" />
            )}

            {/* Loading comments */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}

            {/* Comments list */}
            {!isLoading && comments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No comments yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Be the first to comment!
                </p>
              </div>
            )}

            {!isLoading && comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {comment.user_profile_image && (
                    <AvatarImage src={comment.user_profile_image} alt={comment.user_name} />
                  )}
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                    {getInitials(comment.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 mr-2">
                      {comment.user_name}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 break-words">
                      {comment.text}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(comment.created_at)}
                    </p>
                    {currentUserId === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingCommentId === comment.id}
                        className="text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        {deletingCommentId === comment.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {isLiking ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <FiHeart className="w-6 h-6" />
                )}
              </button>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {likesCount} {likesCount === 1 ? "like" : "likes"}
              </span>
            </div>
          </div>

          {/* Comment input */}
          <form
            onSubmit={handleSubmitComment}
            className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3"
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!newComment.trim() || isPosting}
              className="text-blue-500 hover:text-blue-600 font-semibold disabled:opacity-50"
            >
              {isPosting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
