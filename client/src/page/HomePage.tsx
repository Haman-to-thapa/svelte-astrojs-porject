import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Video } from '../types/Video';
import { videoApi } from '../services/api';
import VideoCard from '../components/Video/VideoCard';
import { Loader, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Get search query from URL if coming from header search
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [location]);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [searchQuery, videos]);

  const loadVideos = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const videosData = await videoApi.getVideos();
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterVideos = () => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos);
      return;
    }

    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  // Generate structured data for the video collection
  const generateStructuredData = () => {
    if (videos.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "MiniTube Video Collection",
      "description": "Collection of videos available on MiniTube",
      "numberOfItems": videos.length,
      "itemListElement": videos.slice(0, 10).map((video, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "VideoObject",
          "name": video.title,
          "description": video.description,
          "thumbnailUrl": video.thumbnailUrl,
          "uploadDate": video.uploadDate,
          "duration": `PT${video.duration}S`,
          "url": `https://your-frontend-url.onrender.com/video/${video._id}`
        }
      }))
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Helmet>
          <title>Loading Videos - MiniTube</title>
          <meta name="description" content="Loading video collection on MiniTube" />
        </Helmet>
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-youtube-red" />
          <span className="text-gray-600">Loading videos...</span>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData();
  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}" - MiniTube`
    : 'MiniTube - Watch & Share Videos | YouTube Clone';

  const pageDescription = searchQuery
    ? `Search results for "${searchQuery}" - Found ${filteredVideos.length} videos on MiniTube`
    : `Watch ${filteredVideos.length} amazing videos on MiniTube. Free video sharing platform with the best YouTube clone experience.`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={
            searchQuery
              ? `${searchQuery}, video search, find videos`
              : "videos, youtube clone, video sharing, watch videos, streaming, mini tube, free videos"
          }
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://your-frontend-url.onrender.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MiniTube" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* Canonical URL */}
        <link rel="canonical" href="https://your-frontend-url.onrender.com" />

        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MiniTube" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Search-specific meta tags */}
        {searchQuery && (
          <meta name="robots" content="noindex, follow" />
        )}
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended Videos'}
            </h1>
            <p className="text-gray-600 mt-2">
              {searchQuery
                ? `Found ${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `Discover ${filteredVideos.length} amazing video${filteredVideos.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          <button
            onClick={() => loadVideos(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <RefreshCw className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? 'No videos found' : 'Welcome to MiniTube!'}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery
                  ? `No videos found for "${searchQuery}". Try different keywords or browse our video collection.`
                  : 'Start watching amazing videos! Use the "Add Sample" button to add demo videos or explore our growing collection.'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Video Grid with semantic markup */}
            <section aria-label="Video collection">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                itemScope
                itemType="https://schema.org/ItemList"
              >
                {filteredVideos.map((video) => (
                  <div
                    key={video._id}
                    itemScope
                    itemType="https://schema.org/VideoObject"
                    itemProp="itemListElement"
                  >
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            </section>

            {/* Load more indicator for future pagination */}
            {videos.length > 20 && (
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">
                  Showing {filteredVideos.length} of {videos.length} videos
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;