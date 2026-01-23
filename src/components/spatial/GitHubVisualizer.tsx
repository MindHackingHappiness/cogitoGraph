import { memo, useMemo } from 'react';
import { Group } from '@react-three/fiber';
import { GitHubRepo } from '@/lib/github/types';
import { clusterReposByTopic } from '@/lib/github/clusterer';
import { GitHubNode } from './GitHubNode';

interface GitHubVisualizerProps {
  repos: GitHubRepo[];
}

interface NodePositions {
  nodes: Record<string, [number, number, number]>;
  centers: Record<string, [number, number, number]>;
}

const calculateNodePositions = (
  clusters: Map<string, GitHubRepo[]>
): NodePositions => {
  const positions: NodePositions = { nodes: {}, centers: {} };
  const clusterArray = Array.from(clusters.entries());

  // Position cluster centers in a circle
  clusterArray.forEach(([topic, repos], index) => {
    const angle = (index / clusterArray.length) * Math.PI * 2;
    const radius = 15;

    positions.centers[topic] = [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    ];

    // Position repos around their cluster center
    repos.forEach((repo, repoIndex) => {
      const repoAngle = (repoIndex / repos.length) * Math.PI * 2;
      const repoRadius = 3 + (repoIndex % 3); // Vary orbit radius

      positions.nodes[repo.id] = [
        positions.centers[topic][0] + Math.cos(repoAngle) * repoRadius,
        Math.sin(repoAngle * 2) * 2, // Slight vertical variation
        positions.centers[topic][2] + Math.sin(repoAngle) * repoRadius,
      ];
    });
  });

  return positions;
};

export const GitHubVisualizer = memo(({ repos }: GitHubVisualizerProps) => {
  const clusters = useMemo(() => clusterReposByTopic(repos), [repos]);
  const nodePositions = useMemo(
    () => calculateNodePositions(clusters),
    [clusters]
  );

  return (
    <Group>
      {/* Render cluster centers */}
      {Array.from(clusters.entries()).map(([topic, clusterRepos]) => (
        <Group key={topic} position={nodePositions.centers[topic]}>
          {/* TODO: Add cluster center visualization in later task */}
        </Group>
      ))}

      {/* Render individual repos */}
      {repos.map((repo) => (
        <GitHubNode
          key={repo.id}
          repo={repo}
          position={nodePositions.nodes[repo.id]}
        />
      ))}
    </Group>
  );
});

GitHubVisualizer.displayName = 'GitHubVisualizer';
