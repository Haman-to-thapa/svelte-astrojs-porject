import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Video } from '../../types/Video';
import { videoApi } from '../../services/api';
import { ArrowLeft, Eye, Calendar, Loader } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const videoData = await videoApi.getVideo(id);
        setVideo(videoData);
      } catch (err) {
        setError('Failed to load video');
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate structured data for the video
  const generateStructuredData = () => {
    if (!video) return null;

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
      "interactionCount": video.views,
      "author": {
        "@type": "Organization",
        "name": "MiniTube"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MiniTube",
        "logo": {
          "@type": "ImageObject",
          "url": "https://your-frontend-url.onrender.com/logo.png"
        }
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Helmet>
          <title>Loading Video - MiniTube</title>
          <meta name="description" content="Loading video content on MiniTube" />
        </Helmet>
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-youtube-red" />
          <span className="text-gray-600">Loading video...</span>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Helmet>
          <title>Video Not Found - MiniTube</title>
          <meta name="description" content="The requested video could not be found on MiniTube" />
        </Helmet>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The video you are looking for does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-youtube-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Videos</span>
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{video.title} - MiniTube</title>
        <meta
          name="description"
          content={`Watch "${video.title}" on MiniTube. ${video.description.substring(0, 160)}...`}
        />
        <meta
          name="keywords"
          content={`${video.title}, video, watch, MiniTube, ${video.description.split(' ').slice(0, 10).join(', ')}`}
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description} />
        <meta property="og:image" content={video.thumbnailUrl} />
        <meta property="og:url" content={`https://your-frontend-url.onrender.com/video/${video._id}`} />
        <meta property="og:type" content="video.other" />
        <meta property="og:video:url" content={video.videoUrl} />
        <meta property="og:video:secure_url" content={video.videoUrl} />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content={video.description} />
        <meta name="twitter:image" content={video.thumbnailUrl} />
        <meta name="twitter:player" content={video.videoUrl} />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />

        {/* Canonical URL */}
        <link rel="canonical" href={`https://your-frontend-url.onrender.com/video/${video._id}`} />

        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Videos</span>
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Video Container */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg mb-6">
            <video
              controls
              autoPlay
              className="w-full aspect-video"
              poster={video.thumbnailUrl}
              preload="metadata"
            >
              <source src={video.videoUrl} type="video/mp4" />
              <track
                kind="captions"
                src={`/captions/${video._id}.vtt`}
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {video.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Uploaded on {formatDate(video.uploadDate)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;