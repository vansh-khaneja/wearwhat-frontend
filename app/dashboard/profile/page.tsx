"use client";
import { useState, useEffect, useRef } from "react";
import { FiHeart, FiMessageCircle, FiTrash2, FiEdit2, FiCamera, FiCheck, FiX } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { postsService, type Post } from "@/lib/api/posts";
import { userService, type UserProfile } from "@/lib/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  // Profile image upload
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserAndPosts();
  }, []);

  const fetchUserAndPosts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [userResponse, postsResponse] = await Promise.all([
        userService.getProfile(),
        postsService.getMyPosts(),
      ]);

      if (userResponse.success) {
        setUser(userResponse.user);
        setEditFirstName(userResponse.user.first_name);
        setEditLastName(userResponse.user.last_name);
      }

      if (postsResponse.success) {
        setPosts(postsResponse.posts);
      }
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePostId) return;

    setIsDeleting(true);
    try {
      const response = await postsService.delete(deletePostId);
      if (response.success) {
        setPosts((prev) => prev.filter((post) => post.id !== deletePostId));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
      setDeletePostId(null);
    }
  };

  const handleStartEditName = () => {
    if (user) {
      setEditFirstName(user.first_name);
      setEditLastName(user.last_name);
      setIsEditingName(true);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    if (user) {
      setEditFirstName(user.first_name);
      setEditLastName(user.last_name);
    }
  };

  const handleSaveName = async () => {
    if (!editFirstName.trim() || !editLastName.trim()) return;

    setIsSavingName(true);
    try {
      const response = await userService.updateProfile({
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
      });
      if (response.success) {
        setUser(response.user);
        setIsEditingName(false);
      }
    } catch (err) {
      console.error("Update name error:", err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const response = await userService.uploadProfileImage(file);
      if (response.success) {
        setUser(response.user);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploadingImage(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const userName = user ? `${user.first_name} ${user.last_name}` : "User";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Profile Header */}
      <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Profile Image with upload */}
        <div className="relative group">
          <Avatar className="w-24 h-24">
            {user?.profile_image_url && (
              <AvatarImage src={user.profile_image_url} alt={userName} />
            )}
            <AvatarFallback className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-2xl font-semibold">
              {user ? getInitials(user.first_name, user.last_name) : "U"}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={handleImageClick}
            disabled={isUploadingImage}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {isUploadingImage ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <FiCamera className="w-6 h-6 text-white" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                placeholder="First name"
                className="w-32"
              />
              <Input
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                placeholder="Last name"
                className="w-32"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveName}
                disabled={isSavingName || !editFirstName.trim() || !editLastName.trim()}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                {isSavingName ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FiCheck className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEditName}
                disabled={isSavingName}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <FiX className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {userName}
              </h1>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleStartEditName}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiEdit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-6 flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          My Posts
        </h2>

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
              onClick={fetchUserAndPosts}
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
              Create your first outfit and share it with the community!
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
                {/* Header with delete button */}
                <div className="flex items-center justify-between p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(post.created_at)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletePostId(post.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
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

                {/* Stats */}
                <div className="flex items-center gap-6 p-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiHeart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes_count}</span>
                  </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Comments Modal */}
      {selectedPost && (
        <CommentsModal
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onLike={() => {}}
        />
      )}
    </div>
  );
}
