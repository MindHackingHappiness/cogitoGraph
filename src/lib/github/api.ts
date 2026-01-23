import { GitHubRepo, GitHubAPIResponse } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

export const fetchFromGitHubAPI = async (
  username: string
): Promise<GitHubRepo[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      throw new Error(`Rate limited. Reset at ${resetTime}`);
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data: GitHubAPIResponse[] = await response.json();

  return data.map((repo) => ({
    id: repo.id.toString(),
    name: repo.name,
    description: repo.description || 'No description',
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    url: repo.html_url,
    topics: repo.topics,
    updatedAt: repo.updated_at,
  }));
};
