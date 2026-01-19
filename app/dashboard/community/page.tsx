"use client";
import { useState, useEffect } from "react";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { postsService, type Post } from "@/lib/api/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentsModal from "@/components/dashboard/CommentsModal";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
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

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await postsService.getFeed();
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      console.error("Fetch posts error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (likingPostId) return;

    setLikingPostId(postId);
    try {
      const response = await postsService.like(postId);
      if (response.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likes_count: response.likes_count }
              : post
          )
        );
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikingPostId(null);
    }
  };

  const handleLikeFromModal = (postId: string) => {
    // Update the post in the list when liked from modal
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      )
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Style Community
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Share your favorite outfits and get inspired by others
      </p>

      <div className="mt-8 flex-1 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No posts yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Be the first to share your outfit with the community!
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* User Header */}
                <div className="flex items-center gap-3 p-4">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(post.created_at)}
                    </p>
                  </div>
                </div>

                {/* Content */}
                {post.text && (
                  <div className="px-4 pb-3">
                    <p className="text-gray-700 dark:text-gray-300">{post.text}</p>
                  </div>
                )}

                {/* Image - clickable to open comments */}
                <div
                  className="bg-gray-50 dark:bg-gray-900/50 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.image_url}
                    alt="Outfit"
                    className="w-full"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 p-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={likingPostId === post.id}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {likingPostId === post.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <FiHeart className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{post.likes_count}</span>
                  </button>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <FiMessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments_count}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Modal */}
      {selectedPost && (
        <CommentsModal
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onLike={handleLikeFromModal}
        />
      )}
    </div>
  );
}
