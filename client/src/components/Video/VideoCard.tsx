import React from 'react';
import { Link } from 'react-router-dom';
import type { Video } from '../../types/Video';
import { Play, Eye, Clock } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate structured data for SEO
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": video.title,
      "description": video.description,
      "thumbnailUrl": video.thumbnailUrl,
      "uploadDate": video.uploadDate,
      "duration": `PT${video.duration}S`,
      "contentUrl": video.videoUrl,
      "embedUrl": video.videoUrl,
      "interactionCount": video.views
    };
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />

      <Link to={`/video/${video._id}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
          {/* Thumbnail Container */}
          <div className="relative aspect-video bg-gray-200 overflow-hidden">
            <img
              src={video.thumbnailUrl}
              alt={`Watch ${video.title} on MiniTube`}
              title={video.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium">
              {formatDuration(video.duration)}
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-youtube-red transition-colors mb-2">
              {video.title}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {video.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{formatViews(video.views)}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(video.uploadDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default VideoCard;