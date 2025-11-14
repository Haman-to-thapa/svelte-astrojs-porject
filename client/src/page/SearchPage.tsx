import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Video } from '../types/Video';
import { videoApi } from '../services/api';
import VideoCard from '../components/Video/VideoCard';
import { Search, Loader } from 'lucide-react';
import SeoHead from '../components/SEO/SeoHead';

const SearchPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0 && query) {
      filterVideos();
    }
  }, [query, videos]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const videosData = await videoApi.getVideos();
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    if (!query.trim()) {
      setFilteredVideos(videos);
      return;
    }

    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  // Generate structured data for search results
  const generateStructuredData = () => {
    if (filteredVideos.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      "name": `Search Results for "${query}"`,
      "description": `Found ${filteredVideos.length} videos for "${query}" on MiniTube`,
      "query": query,
      "numberOfItems": filteredVideos.length,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": filteredVideos.length,
        "itemListElement": filteredVideos.slice(0, 10).map((video, index) => ({
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
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SeoHead
          title="Searching Videos - MiniTube"
          description="Searching for videos on MiniTube"
          noindex={true}
        />
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-youtube-red" />
          <span className="text-gray-600">Searching videos...</span>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData();
  const pageTitle = query
    ? `"${query}" - Search Results - MiniTube`
    : 'Search Videos - MiniTube';

  const pageDescription = query
    ? `Search results for "${query}" - Found ${filteredVideos.length} videos on MiniTube. Watch ${filteredVideos.length} amazing videos matching your search.`
    : 'Search through our video collection on MiniTube. Find the perfect videos to watch and enjoy.';

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        keywords={query ? `${query}, search results, video search, find ${query} videos` : 'search, videos, find videos'}
        canonical="https://your-frontend-url.onrender.com/" // Point to home page to avoid duplicate content
        structuredData={structuredData}
        noindex={true} // Prevent search pages from being indexed
        ogTitle={pageTitle}
        ogDescription={pageDescription}
        ogUrl={`https://your-frontend-url.onrender.com/search?q=${encodeURIComponent(query)}`}
        twitterCard="summary"
        twitterTitle={pageTitle}
        twitterDescription={pageDescription}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results
              {query && (
                <span className="text-gray-600"> for "{query}"</span>
              )}
            </h1>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
              {query && ` for "${query}"`}
            </p>

            {/* Search tips for better UX and SEO */}
            {filteredVideos.length === 0 && query && (
              <div className="text-sm text-gray-500">
                Try: different keywords, fewer words, or check spelling
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {query ? 'No videos found' : 'Search MiniTube Videos'}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {query
                ? `No videos found for "${query}". Try different keywords or browse our video collection.`
                : 'Enter a search term above to find videos in our collection.'
              }
            </p>

            {/* Suggested searches for better UX */}
            {query && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Try these searches instead:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['React', 'JavaScript', 'Web Development', 'Tutorial'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => window.location.href = `/search?q=${encodeURIComponent(suggestion)}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search results with semantic markup */}
            <section
              aria-label={`Search results for ${query}`}
              itemScope
              itemType="https://schema.org/SearchResultsPage"
            >
              <meta itemProp="query" content={query} />
              <meta itemProp="numberOfItems" content={filteredVideos.length.toString()} />

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                itemScope
                itemType="https://schema.org/ItemList"
                itemProp="mainEntity"
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

            {/* Search results summary */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Showing {filteredVideos.length} of {videos.length} total videos
                {query && ` matching "${query}"`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;