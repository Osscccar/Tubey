"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Video {
  id: string;
  playbackId: string;
  title: string;
  description?: string;
  duration?: number;
  createdAt: string;
  aspectRatio?: string;
}

interface VideoGridProps {
  searchQuery?: string;
}

export default function VideoGrid({ searchQuery = "" }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      params.append("limit", "20");

      const response = await fetch(`/api/videos?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 aspect-video rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchVideos}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">
          {searchQuery
            ? `No videos found for "${searchQuery}"`
            : "No videos available"}
        </p>
        {!searchQuery && (
          <p className="text-gray-500 mt-2">
            Upload your first video to get started!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-6">
      {videos.map((video) => (
        <Link key={video.id} href={`/watch/${video.id}`} className="group">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-video bg-gray-900">
              <img
                src={`https://image.mux.com/${video.playbackId}/thumbnail.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {video.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {formatDate(video.createdAt)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
