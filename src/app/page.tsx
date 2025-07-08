'use client';
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [apiResponse, setApiResponse] = useState<any>(null);

  const handleClick = async () => {
    try {
      const response = await axios.post("/api/recommend", { userId: "12345" });
      setApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching API response:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        Response:
        {apiResponse?.recommendations?.map((rec: string, idx: number) => (
          <div key={idx}>{rec}</div>
        ))}
      </div>
      <div>
        <button onClick={handleClick}>Click Me</button>
      </div>
    </div>
  );
}
