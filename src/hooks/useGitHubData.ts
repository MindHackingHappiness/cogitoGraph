import { useRef } from 'react';
import { GitHubRepo } from '@/lib/github/types';
import { generateMockGitHubData } from '@/lib/github/mockData';
import { fetchFromGitHubAPI } from '@/lib/github/api';

interface CachedData {
  data: GitHubRepo[];
  timestamp: number;
}

export const useGitHubData = () => {
  const cache = useRef<Map<string, CachedData>>(new Map());

  const fetchRepos = async (
    username: string,
    isRealMode: boolean
  ): Promise<GitHubRepo[]> => {
    const cacheKey = `${username}_${isRealMode}`;
    const cached = cache.current.get(cacheKey);

    // Check cache (5-minute TTL for real mode)
    const now = Date.now();
    const isRealModeExpired = cached && (now - cached.timestamp) > 300000;

    if (cached && (!isRealMode || !isRealModeExpired)) {
      return cached.data;
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Fetch from API or mock
    let data: GitHubRepo[];

    if (isRealMode) {
      data = await fetchFromGitHubAPI(username);
    } else {
      data = generateMockGitHubData(username);
    }

    // Cache result
    cache.current.set(cacheKey, { data, timestamp: now });

    return data;
  };

  return {
    fetchRepos,
    cache: cache.current,
  };
};
