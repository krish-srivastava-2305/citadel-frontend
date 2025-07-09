'use client';
import userData from "@/sampleData/sampleData";
import axios from "axios";
import Queue from "./util/queue";
import { useEffect, useState } from "react";

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
    console.log("Liked", nextRecommendation?.id);
    getNextUser();
  };

  const handleDislike = () => {
    console.log("Disliked", nextRecommendation?.id);
    getNextUser();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm">
        <span>12:45</span>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>

      {nextRecommendation ? (
        <div className="px-4 pb-4">
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Profile Image Container */}
            <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <div className="text-6xl font-bold text-white opacity-50">
                {nextRecommendation.name.split(' ').map((n: string) => n[0]).join('')}
              </div>

              {/* Friend Badge */}
              <div className="absolute bottom-4 left-4 bg-gray-800 px-3 py-1 rounded-full text-sm">
                Friend
              </div>

              {/* Age Badge */}
              <div className="absolute top-4 right-4 bg-gray-800 px-3 py-2 rounded-full">
                <span className="text-2xl font-bold">{nextRecommendation.personal?.age}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{nextRecommendation.name}</h1>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">🎓</span>
                  <span>{nextRecommendation.academic?.degreeProgram}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">📍</span>
                  <span>{nextRecommendation.geographic?.city}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-300 mb-4">{nextRecommendation.profileContent?.bio}</p>

              {/* Interests */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {nextRecommendation.personal?.interests?.map((interest: string, index: number) => (
                    <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">University</h4>
                  <p className="text-gray-300 text-sm">{nextRecommendation.academic?.university}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Personality</h4>
                  <p className="text-gray-300 text-sm">{nextRecommendation.profileContent?.personalityPrompts}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Previous Likes</h4>
                  <div className="flex flex-wrap gap-2">
                    {nextRecommendation.behavioural?.previousLikes?.map((like: string, index: number) => (
                      <span key={index} className="bg-green-800 px-2 py-1 rounded text-xs">
                        {like}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Response Style</h4>
                  <p className="text-gray-300 text-sm">{nextRecommendation.behavioural?.responsePatterns}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleDislike}
              className="bg-gray-800 hover:bg-red-700 transition-colors px-8 py-3 rounded-full text-lg font-semibold"
            >
              Dislike
            </button>
            <button
              onClick={handleLike}
              className="bg-green-500 hover:bg-green-600 transition-colors px-8 py-3 rounded-full text-lg font-semibold"
            >
              Like
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">Loading recommendation...</div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 px-4 py-2">
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
      </div>
    </div>
  );
}