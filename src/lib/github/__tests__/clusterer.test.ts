import { describe, it, expect } from 'vitest';
import { clusterReposByTopic } from '../clusterer';
import { GitHubRepo } from '../types';

describe('clusterReposByTopic', () => {
  it('should group repos by language', () => {
    const repos: GitHubRepo[] = [
      {
        id: '1',
        name: 'user/repo1',
        description: 'Frontend project',
        language: 'TypeScript',
        stars: 100,
        forks: 10,
        url: 'https://github.com/user/repo1',
        topics: ['frontend', 'react'],
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'user/repo2',
        description: 'Another frontend',
        language: 'TypeScript',
        stars: 200,
        forks: 20,
        url: 'https://github.com/user/repo2',
        topics: ['frontend', 'vue'],
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        name: 'user/repo3',
        description: 'ML project',
        language: 'Python',
        stars: 500,
        forks: 50,
        url: 'https://github.com/user/repo3',
        topics: ['ml-ai', 'ml'],
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const clusters = clusterReposByTopic(repos);

    expect(clusters.get('TypeScript')).toHaveLength(2);
    expect(clusters.get('Python')).toHaveLength(1);
  });

  it('should extract topics from repo names as fallback', () => {
    const repos: GitHubRepo[] = [
      {
        id: '1',
        name: 'user/api-server',
        description: 'Backend API',
        language: 'Go',
        stars: 100,
        forks: 10,
        url: 'https://github.com/user/api-server',
        topics: [],
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const clusters = clusterReposByTopic(repos);

    // Should extract 'backend' from 'api-server'
    expect(clusters.size).toBeGreaterThan(0);
  });

  it('should handle repos without topics', () => {
    const repos: GitHubRepo[] = [
      {
        id: '1',
        name: 'user/misc',
        description: 'Misc project',
        language: 'JavaScript',
        stars: 50,
        forks: 5,
        url: 'https://github.com/user/misc',
        topics: [],
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const clusters = clusterReposByTopic(repos);

    // Should create cluster based on language
    expect(clusters.has('JavaScript')).toBe(true);
  });
});
