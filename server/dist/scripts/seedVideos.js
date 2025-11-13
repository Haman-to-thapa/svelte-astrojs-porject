"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Video_1 = __importDefault(require("../model/Video"));
dotenv_1.default.config();
const sampleVideos = [
    {
        title: 'Introduction to React with TypeScript',
        description: 'Learn how to build modern React applications using TypeScript. This tutorial covers components, hooks, and type safety.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 354,
        views: 12500
    },
    {
        title: 'Building REST APIs with Node.js and Express',
        description: 'Complete guide to creating RESTful APIs using Node.js, Express, and MongoDB. Includes authentication and error handling.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 428,
        views: 8900
    },
    {
        title: 'Tailwind CSS Crash Course',
        description: 'Learn Tailwind CSS from scratch. Build responsive, modern websites without writing custom CSS.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 276,
        views: 15600
    },
    {
        title: 'MongoDB Aggregation Pipeline Tutorial',
        description: 'Deep dive into MongoDB aggregation framework. Learn about $match, $group, $project, and more advanced stages.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 512,
        views: 7200
    },
    {
        title: 'Full Stack MERN Application Development',
        description: 'Build a complete MERN stack application from start to deployment. Includes React, Node.js, Express, and MongoDB integration.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 623,
        views: 21000
    },
    {
        title: 'TypeScript for JavaScript Developers',
        description: 'Transition from JavaScript to TypeScript. Learn about types, interfaces, generics, and advanced TypeScript features.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 387,
        views: 14300
    },
    {
        title: 'React Hooks Deep Dive',
        description: 'Master React Hooks including useState, useEffect, useContext, and custom hooks. Real-world examples and best practices.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 445,
        views: 18200
    },
    {
        title: 'Docker for Developers',
        description: 'Learn Docker containerization for your applications. Includes Dockerfile, Docker Compose, and deployment strategies.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 498,
        views: 9600
    },
    {
        title: 'GraphQL vs REST: Which to Choose?',
        description: 'Comparison between GraphQL and REST APIs. Learn when to use each technology and their pros and cons.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 334,
        views: 11200
    },
    {
        title: 'Microservices Architecture Patterns',
        description: 'Learn about microservices architecture, communication patterns, service discovery, and deployment strategies.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 567,
        views: 7800
    },
    {
        title: 'Web Performance Optimization',
        description: 'Techniques to improve website performance including lazy loading, code splitting, caching, and image optimization.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 412,
        views: 16500
    },
    {
        title: 'CI/CD Pipeline with GitHub Actions',
        description: 'Set up continuous integration and deployment using GitHub Actions. Automate testing and deployment for your projects.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551135049-8a33b42738c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        duration: 389,
        views: 8900
    }
];
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-clone');
        console.log('Connected to MongoDB');
        // Clear existing videos
        await Video_1.default.deleteMany({});
        console.log('Cleared existing videos');
        // Insert sample videos
        const createdVideos = await Video_1.default.insertMany(sampleVideos);
        console.log(`Successfully seeded ${createdVideos.length} videos`);
        // Display inserted videos
        createdVideos.forEach(video => {
            console.log(`- ${video.title} (${video.duration}s)`);
        });
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
};
// Run the seed function
seedDatabase();
