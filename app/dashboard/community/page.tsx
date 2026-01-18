"use client";
import React from "react";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";

const communityPosts = [
  {
    id: 1,
    user: "Sarah M.",
    avatar: "https://i.pravatar.cc/150?img=1",
    time: "2 hours ago",
    content: "Loving this new outfit! What do you all think?",
    image: "https://source.unsplash.com/random/400x400?outfit&sig=1",
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    user: "Alex K.",
    avatar: "https://i.pravatar.cc/150?img=2",
    time: "5 hours ago",
    content: "Perfect casual Friday look 💼",
    image: "https://source.unsplash.com/random/400x400?fashion&sig=2",
    likes: 18,
    comments: 3,
  },
  {
    id: 3,
    user: "Emma R.",
    avatar: "https://i.pravatar.cc/150?img=3",
    time: "1 day ago",
    content: "Date night ready!",
    image: "https://source.unsplash.com/random/400x400?style&sig=3",
    likes: 42,
    comments: 8,
  },
  {
    id: 4,
    user: "James L.",
    avatar: "https://i.pravatar.cc/150?img=4",
    time: "1 day ago",
    content: "Business casual done right 👔",
    image: "https://source.unsplash.com/random/400x400?clothes&sig=4",
    likes: 31,
    comments: 6,
  },
  {
    id: 5,
    user: "Olivia P.",
    avatar: "https://i.pravatar.cc/150?img=5",
    time: "2 days ago",
    content: "Weekend vibes 🌸",
    image: "https://source.unsplash.com/random/400x400?wardrobe&sig=5",
    likes: 56,
    comments: 12,
  },
  {
    id: 6,
    user: "Michael T.",
    avatar: "https://i.pravatar.cc/150?img=6",
    time: "3 days ago",
    content: "Gym to brunch transition 💪",
    image: "https://source.unsplash.com/random/400x400?casual&sig=6",
    likes: 28,
    comments: 4,
  },
];

export default function CommunityPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Style Community
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Share your favorite outfits and get inspired by others
      </p>

      <div className="mt-8 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* User Header */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src={post.avatar}
                  alt={post.user}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.user}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.time}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
              </div>

              {/* Image */}
              <img
                src={post.image}
                alt="Outfit"
                className="w-full h-64 object-cover"
              />

              {/* Actions */}
              <div className="flex items-center gap-6 p-4 border-t border-gray-100 dark:border-gray-700">
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                  <FiHeart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <FiMessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors ml-auto">
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
