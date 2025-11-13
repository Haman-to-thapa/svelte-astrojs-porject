import axios from 'axios';
import type { Video } from '../types/Video'; 

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const videoApi = {
  getVideos: async (): Promise<Video[]> => {
    const response = await api.get<Video[]>('/videos');
    return response.data;
  },

  getVideo: async (id: string): Promise<Video> => {
    const response = await api.get<Video>(`/videos/${id}`);
    return response.data;
  },

  createVideo: async (videoData: Partial<Video>): Promise<Video> => {
    const response = await api.post<Video>('/videos', videoData);
    return response.data;
  },

  updateVideo: async (id: string, videoData: Partial<Video>): Promise<Video> => {
    const response = await api.patch<Video>(`/videos/${id}`, videoData);
    return response.data;
  },
};
