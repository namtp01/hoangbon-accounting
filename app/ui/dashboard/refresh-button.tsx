'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh(); // This will refresh the server components
  };

  return (
    <button
      onClick={handleRefresh}
      className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200"
    >
      <ArrowPathIcon className="h-4 w-4" />
      Refresh
    </button>
  );
}