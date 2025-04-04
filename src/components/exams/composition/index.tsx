// app/components/RandomQuestionComponent.tsx

import React from 'react';
import fetcher from 'src/utils/fetcher'; // Update this import path as needed
import { ApiResponse } from 'src/types/common'; // Update this import path as needed

// Define the type for the question data
interface QuestionData {
  id?: string;
  title?: string;
  description?: string;
  options?: string[];
  difficulty?: string;
  category?: string;
}

async function getRandomQuestion(): Promise<QuestionData | null> {
  // Define any payload needed for the POST request
  // If no payload is needed, you can pass an empty object
  const requestPayload = {
    // Add any parameters needed for your API
    limit: 1,
    randomize: true
  };

  const response = await fetcher<ApiResponse>(
    requestPayload,
    '/api/questions/composition/random'
  );

  // Check if the request was successful
  if (response.error || !response.data) {
    console.error("Failed to fetch random question:", response.error);
    throw new Error(response.error || "Failed to load question data");
  }

  // Extract the question data from the API response
  const apiResponse = response.data;
  
  // Validate the API response structure
  if (apiResponse.status === 'error' || !apiResponse.data) {
    throw new Error(apiResponse.message || "Invalid response from API");
  }

  // Cast the data to our QuestionData type
  return apiResponse.data as QuestionData;
}

export default async function RandomQuestionComponent() {
  let questionData: QuestionData | null = null;
  let error: string | null = null;
  
  try {
    questionData = await getRandomQuestion();
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
  }
  
  // Handle error state
  if (error || !questionData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4 text-red-700">
        <p className="font-medium mb-2">Sorry, we couldn't load the question. Please try again later.</p>
        <p className="text-sm">{error || "No data available"}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {questionData.title || 'Random Question'}
      </h2>
      
      {questionData.description && (
        <p className="text-gray-600 mb-6">{questionData.description}</p>
      )}
      
      {questionData.options && questionData.options.length > 0 && (
        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-2">Options:</p>
          <ul className="space-y-2">
            {questionData.options.map((option, index) => (
              <li 
                key={index}
                className="bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        {questionData.difficulty && (
          <span className="flex items-center">
            <span className="mr-1">Difficulty:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              questionData.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
              questionData.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {questionData.difficulty}
            </span>
          </span>
        )}
        
        {questionData.category && (
          <span className="text-gray-500">
            Category: {questionData.category}
          </span>
        )}
      </div>
    </div>
  );
}
