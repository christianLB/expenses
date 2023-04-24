// hooks/useOpenAi.js
import { useState } from "react";

const useOpenAi = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatGptRequest = async (prompt, maxTokens) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, maxTokens }),
      });

      if (!res.ok) {
        throw new Error("Error calling the ChatGPT API");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, chatGptRequest };
};

export default useOpenAi;
