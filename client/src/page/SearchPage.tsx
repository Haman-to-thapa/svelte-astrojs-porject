import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Video } from '../types/Video';
import { videoApi } from '../services/api';
import VideoCard from '../components/Video/VideoCard';
import { Search, Loader } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-youtube-red" />
          <span className="text-gray-600">Loading videos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

          <p className="text-gray-600">
            Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
          </p>
        </div>

        {/* Search Results */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500">
              {query
                ? `No videos found for "${query}". Try different keywords.`
                : 'Enter a search term to find videos.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;