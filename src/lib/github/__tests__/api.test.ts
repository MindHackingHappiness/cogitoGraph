import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFromGitHubAPI } from '../api';

global.fetch = vi.fn();

describe('fetchFromGitHubAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch repos from GitHub API', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'test/repo',
        description: 'Test',
        language: 'TypeScript',
        stargazers_count: 100,
        forks_count: 10,
        html_url: 'https://github.com/test/repo',
        topics: ['frontend'],
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    } as Response);

    const repos = await fetchFromGitHubAPI('testuser');

    expect(repos).toHaveLength(1);
    expect(repos[0].name).toBe('test/repo');
  });

  it('should handle 404 errors', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchFromGitHubAPI('nonexistentuser')).rejects.toThrow('User not found');
  });

  it('should handle rate limiting', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: {
        get: (name: string) => name === 'X-RateLimit-Reset' ? '1234567890' : null,
      },
    } as Response);

    await expect(fetchFromGitHubAPI('testuser')).rejects.toThrow('Rate limited');
  });
});
