import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Canvas } from '@react-three/fiber';
import { GitHubNode } from '../GitHubNode';
import { GitHubRepo } from '@/lib/github/types';

describe('GitHubNode', () => {
  it('should render without crashing', () => {
    const repo: GitHubRepo = {
      id: '1',
      name: 'test/repo',
      description: 'Test repo',
      language: 'TypeScript',
      stars: 100,
      forks: 25,
      url: 'https://github.com/test/repo',
      topics: ['frontend'],
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const { container } = render(
      <Canvas>
        <GitHubNode repo={repo} position={[0, 0, 0]} />
      </Canvas>
    );

    expect(container).toBeTruthy();
  });
});
