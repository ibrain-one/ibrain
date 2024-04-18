"use client"
import React, { useState } from 'react';

export default function MicroAppPage() {
  const [apiResponse, setApiResponse] = useState(null);

  const handleFetchData = async () => {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: 'SELECT * FROM customers',
          parameters: []
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (error: any) {
      console.error('Fetching error:', error);
      setApiResponse(error.message);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center">
        Database Page Micro App
      </h1>
      <div className="flex flex-col items-center mt-5">
        <button
          onClick={handleFetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Fetch Data
        </button>
        {apiResponse && (
          <div className="mt-5">
            <h2 className="text-lg font-semibold">API Response:</h2>
            <pre className="bg-gray-100 p-3 rounded">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}
