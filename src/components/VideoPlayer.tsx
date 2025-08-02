'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  playbackId: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
}

export default function VideoPlayer({
  playbackId,
  title,
  autoPlay = false,
  muted = false,
  controls = true,
  className = '',
}: VideoPlayerProps) {
  const [videoError, setVideoError] = useState(false);

  const handleError = () => {
    setVideoError(true);
  };

  if (videoError) {
    return (
      <div className={`relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Video Error</h3>
          <p className="text-sm text-gray-300">
            Unable to load video. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <mux-player
        stream-type="on-demand"
        playback-id={playbackId}
        metadata-video-title={title}
        metadata-viewer-user-id="anonymous"
        controls={controls ? "true" : "false"}
        autoplay={autoPlay ? "muted" : "false"}
        muted={muted}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '16/9'
        }}
        onError={handleError}
      />
      
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      )}
    </div>
  );
}