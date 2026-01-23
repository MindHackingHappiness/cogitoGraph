import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Canvas } from '@react-three/fiber';
import { GitHubVisualizer } from '../GitHubVisualizer';
import { GitHubRepo } from '@/lib/github/types';

describe('GitHubVisualizer', () => {
  it('should render with mock data', () => {
    const repos: GitHubRepo[] = [
      {
        id: '1',
        name: 'test/repo',
        description: 'Test',
        language: 'TypeScript',
        stars: 100,
        forks: 10,
        url: 'https://github.com/test/repo',
        topics: ['frontend'],
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { container } = render(
      <Canvas>
        <GitHubVisualizer repos={repos} />
      </Canvas>
    );

    expect(container).toBeTruthy();
  });
});
