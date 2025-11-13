import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Plus } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddSampleVideo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Sample Video ${Date.now()}`,
          description: 'This is a sample video description created from the frontend',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnailUrl: 'https://via.placeholder.com/320x180/FF0000/FFFFFF?text=Sample+Video',
          duration: Math.floor(Math.random() * 300) + 60
        }),
      });

      if (response.ok) {
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding sample video:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to search results page or filter current page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-youtube-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">▶</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MiniTube</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search videos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-full px-6 hover:bg-gray-200 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddSampleVideo}
            className="flex items-center space-x-2 bg-youtube-red text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sample</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;