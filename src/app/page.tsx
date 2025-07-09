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
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecommenderQueue | null>(new Queue());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextRecommendations, setNextRecommendations] = useState<any | null>(null);

  useEffect(() => {
    if ((!recommendations || recommendations.size() <= 1) && !loading) {
      fetchRecommendations();
    }
  }, [recommendations?.size()]);

  useEffect(() => {
    if (recommendations && recommendations.size() > 0 && !nextRecommendations) {
      getNextUser();
    }
  }, [recommendations]);

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

      setSeenIds(prev => [...prev, nextId]);

      const response = userData.find(user => user.id === Number(nextId));
      setNextRecommendations(response ?? null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    }
  };

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

  const handleLike = () => {
    console.log("Liked", nextRecommendations?.id);
    getNextUser();
  };

  const handleDislike = () => {
    console.log("Disliked", nextRecommendations?.id);
    getNextUser();
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {nextRecommendations ? (
        <div className="relative w-[340px] h-[550px] rounded-xl overflow-hidden bg-gray-900 shadow-lg">
          {/* Top Placeholder */}
          <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>

          {/* User Info */}
          <div className="p-4 flex flex-col items-center justify-between h-full">
            <div className="text-center space-y-1">
              <p className="bg-white text-black px-2 py-1 text-xs rounded-full inline-block">Friend</p>
              <h2 className="text-2xl font-bold">{nextRecommendations.name}</h2>
              <p className="text-sm text-gray-300 mt-1">
                {nextRecommendations.academic?.degreeProgram} • {nextRecommendations.academic?.university}
              </p>
              <p className="text-xs text-gray-400">Graduation Year: {nextRecommendations.academic?.graduationYear}</p>
            </div>

            {/* Personal Info */}
            <div className="mt-4 text-sm space-y-1">
              <p><strong>Age:</strong> {nextRecommendations.personal?.age}</p>
              <p><strong>Gender:</strong> {nextRecommendations.personal?.gender}</p>
              <p><strong>City:</strong> {nextRecommendations.geographic?.city}</p>
              <p><strong>Preferred Areas:</strong> {nextRecommendations.geographic?.preferredAreas?.join(", ")}</p>
              <p><strong>Interests:</strong> {nextRecommendations.personal?.interests?.join(", ")}</p>
              <p><strong>Likes:</strong> {nextRecommendations.behavioural?.previousLikes?.join(", ")}</p>
              <p><strong>Dislikes:</strong> {nextRecommendations.behavioural?.previousDislikes?.join(", ")}</p>
              <p><strong>Prompt:</strong> {nextRecommendations.profileContent?.personalityPrompts}</p>
            </div>

            {/* Like/Dislike Buttons */}
            <div className="flex justify-between gap-4 mt-6 w-full">
              <button
                onClick={handleDislike}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full"
              >
                Dislike
              </button>
              <button
                onClick={handleLike}
                className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                Like
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white">Loading recommendation...</div>
      )}
    </div>
  );
}
