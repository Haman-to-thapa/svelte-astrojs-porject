import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Video } from '../types/Video';
import { videoApi } from '../services/api';
import VideoCard from '../components/Video/VideoCard';
import { Loader, RefreshCw } from 'lucide-react';

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
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'Recommended Videos'}
            </h1>
            <p className="text-gray-600 mt-2">
              {searchQuery
                ? `Found ${filteredVideos.length} videos for "${searchQuery}"`
                : `Showing ${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''}`
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
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? 'No videos found' : 'No Videos Available'}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? `No videos found for "${searchQuery}". Try different keywords.`
                  : 'Add a sample video using the button in the header to get started.'
                }
              </p>
            </div>
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

export default HomePage;