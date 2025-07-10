'use client';
import userData from "@/sampleData/sampleData";
import axios from "axios";
import Queue from "./util/queue";
import { useEffect, useState } from "react";
import ProfilePage from "@/components/ProfileCard";

interface RecommenderQueue {
  enqueue: (item: string) => void;
  dequeue: () => string | undefined;
  peek: () => string | undefined;
  isEmpty: () => boolean;
  size: () => number;
}

export default function Home() {
  const [userId, setUserId] = useState<number>(94);
  const [seenIds, setSeenIds] = useState<string[]>(["94"]);
  const [recommenderSize, setRecommenderSize] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<RecommenderQueue | null>(new Queue());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextRecommendation, setNextRecommendation] = useState<any | null>(null);

  // Initialize Recommendations and Trigger Fetch based on Recommendations Left
  useEffect(() => {
    if ((!recommendations || recommenderSize <= 1) && !loading) {
      fetchRecommendations();
    }
  }, [recommenderSize]);

  // Fetch First Recommendation
  useEffect(() => {
    if (recommendations && recommendations.size() > 0 && !nextRecommendation) {
      getNextUser();
    }
  }, [recommendations]);


  // Fetch Next User Recommendation
  const getNextUser = () => {
    try {
      const nextId = recommendations?.dequeue();
      if (!nextId) return;

      const updatedQueue = new Queue();
      let temp;
      while ((temp = recommendations?.dequeue())) {
        updatedQueue.enqueue(temp);
      }
      setRecommendations(updatedQueue);
      setRecommenderSize(updatedQueue.size());

      setSeenIds(prev => {
        prev.push(nextId);
        return [...prev];
      });

      const response = userData.find(user => user.id === Number(nextId));
      setNextRecommendation(response ?? null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    }
  };

  // Fetch Recommendations from API
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      console.log("Fetching recommendations for userId:", userId);
      const response = await axios.post('/api/recommend', { userId, seen_ids: seenIds });
      const recommends: string[] = response.data.recommendations;
      if (recommends && recommends.length > 0) {
        const newQueue = new Queue();
        recommends.forEach((item: string) => newQueue.enqueue(item));
        setRecommendations(newQueue);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Handle Like and Dislike Actions
  const handleLike = () => {
    console.log("Recommender Queue Size", recommenderSize);
    console.log("Liked", nextRecommendation?.id);
    getNextUser();
  };

  const handleDislike = () => {
    console.log("Recommender Queue Size", recommenderSize);
    console.log("Disliked", nextRecommendation?.id);
    getNextUser();
  };

  return (
    <div className="bg-white text-white min-h-screen">
      {/* Status Bar */}
      {/* <div className="flex justify-between items-center p-4 text-sm">
        <span>12:45</span>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div> */}

      {nextRecommendation ? (
        <ProfilePage
          userData={nextRecommendation}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">Loading recommendation...</div>
        </div>
      )}

      {/* Bottom Navigation */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-gray-800 px-4 py-2">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-green-400 rounded"></div>
            <span className="text-xs text-green-400 mt-1">Explore</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span className="text-xs text-gray-400 mt-1">Events</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span className="text-xs text-gray-400 mt-1">Chats</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span className="text-xs text-gray-400 mt-1">Notifications</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}