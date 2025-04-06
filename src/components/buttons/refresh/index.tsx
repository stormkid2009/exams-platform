'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  questionId?: string;
}

export default function RefreshButton({ questionId }: RefreshButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Trigger a refresh which will re-fetch and re-render the server component
    router.refresh();
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isLoading}
      className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}

