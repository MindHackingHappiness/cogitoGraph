import { describe, it, expect } from 'vitest';
import { GitHubRepo } from '../types';

describe('GitHubRepo', () => {
  it('should create valid GitHubRepo object', () => {
    const repo: GitHubRepo = {
      id: '123',
      name: 'test/repo',
      description: 'Test repository',
      language: 'TypeScript',
      stars: 100,
      forks: 25,
      url: 'https://github.com/test/repo',
      topics: ['frontend', 'react'],
      updatedAt: '2024-01-01T00:00:00Z',
    };

    expect(repo.id).toBe('123');
    expect(repo.name).toBe('test/repo');
    expect(repo.language).toBe('TypeScript');
    expect(repo.stars).toBe(100);
  });
});
