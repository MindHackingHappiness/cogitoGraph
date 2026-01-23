import { describe, it, expect } from 'vitest';
import { generateMockGitHubData } from '../mockData';

describe('generateMockGitHubData', () => {
  it('should generate 100 repos', () => {
    const repos = generateMockGitHubData('testuser');
    expect(repos).toHaveLength(100);
  });

  it('should include username in repo names', () => {
    const repos = generateMockGitHubData('myuser');
    expect(repos[0].name).toContain('myuser/');
  });

  it('should have realistic star counts', () => {
    const repos = generateMockGitHubData('testuser');
    repos.forEach(repo => {
      expect(repo.stars).toBeGreaterThanOrEqual(0);
      expect(repo.stars).toBeLessThanOrEqual(10000);
    });
  });

  it('should have valid languages', () => {
    const repos = generateMockGitHubData('testuser');
    const languages = ['TypeScript', 'Python', 'Rust', 'Go', 'JavaScript'];

    repos.forEach(repo => {
      expect(languages).toContain(repo.language);
    });
  });
});
