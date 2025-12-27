
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

// Standard TypeScript Interface for the Greeting state
interface GreetingData {
  text: string;
  isLoading: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [greeting, setGreeting] = useState<GreetingData>({
    text: '',
    isLoading: false,
    error: null,
  });

  const generateGreeting = useCallback(async () => {
    if (!name.trim()) return;

    setGreeting(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a creative, friendly "Hello World" style greeting for a person named ${name}. Keep it concise but enthusiastic.`,
        config: {
          temperature: 0.8,
          topP: 0.9,
        }
      });

      const resultText = response.text || "Hello World! (Fallback)";
      setGreeting({
        text: resultText,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error("Gemini Error:", err);
      setGreeting({
        text: '',
        isLoading: false,
        error: "Failed to generate greeting. Please try again later.",
      });
    }
  }, [name]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateGreeting();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
            Hello <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">World</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            A minimalist React application demonstrating the power of Gemini-native interactions and Tailwind aesthetics.
          </p>
        </div>

        {/* Interaction Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name-input" className="block text-sm font-semibold text-gray-700 text-left ml-1">
              What's your name?
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your name..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={generateGreeting}
                disabled={greeting.isLoading || !name.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center min-w-[140px]"
              >
                {greeting.isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Get Greeting"
                )}
              </button>
            </div>
          </div>

          {/* Result Area */}
          <div className="min-h-[100px] flex items-center justify-center border-t border-gray-50 pt-6">
            {greeting.error ? (
              <p className="text-red-500 font-medium bg-red-50 px-4 py-2 rounded-lg">{greeting.error}</p>
            ) : greeting.text ? (
              <div className="animate-fade-in">
                <p className="text-2xl font-medium text-gray-800 italic">
                  &ldquo;{greeting.text}&rdquo;
                </p>
              </div>
            ) : (
              <p className="text-gray-400 italic">Enter a name to generate a custom greeting...</p>
            )}
          </div>
        </div>

        {/* Footer / Tech Stack */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          <span className="px-3 py-1 bg-gray-100 rounded-full">React 18</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">TypeScript</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">Tailwind CSS</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">Gemini 3 Flash</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
