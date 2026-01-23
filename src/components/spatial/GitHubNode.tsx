import { memo, useRef, useState, useMemo } from 'react';
import { Sphere } from '@react-three/drei';
import { Html } from '@react-three/drei';
import { Group } from 'three';
import { GitHubRepo } from '@/lib/github/types';
import { calculateNodeSize, getLanguageColorClass } from '@/lib/github/utils';
import { getLanguageColor } from '@/config/githubLanguages';

interface GitHubNodeProps {
  repo: GitHubRepo;
  position: [number, number, number];
}

export const GitHubNode = memo(({ repo, position }: GitHubNodeProps) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Group>(null);

  const size = useMemo(() => calculateNodeSize(repo.stars), [repo.stars]);
  const color = useMemo(() => getLanguageColor(repo.language), [repo.language]);
  const colorClass = useMemo(() => getLanguageColorClass(repo.language), [repo.language]);

  const handleClick = () => {
    window.open(repo.url, '_blank');
  };

  return (
    <group position={position} ref={meshRef}>
      {/* Main node sphere */}
      <Sphere
        args={[size, 32, 32]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </Sphere>

      {/* Repo name label */}
      <Html position={[0, size + 0.5, 0]} center>
        <div className="text-xs font-mono text-white drop-shadow-lg whitespace-nowrap">
          {repo.name}
        </div>
      </Html>

      {/* Fork count badge */}
      {repo.forks > 0 && (
        <Html position={[size * 0.7, size * 0.7, 0]} center>
          <div className="text-[8px] bg-black/70 px-1 rounded text-white whitespace-nowrap">
            🔱 {repo.forks}
          </div>
        </Html>
      )}

      {/* Hover detail popup */}
      {hovered && (
        <Html position={[0, size + 1.5, 0]} center distanceFactor={10}>
          <div className="bg-black/95 border border-cyber-primary p-3 rounded max-w-xs shadow-xl">
            <h3 className="text-cyber-primary font-bold text-sm">{repo.name}</h3>
            <p className="text-xs mt-1 text-gray-300 line-clamp-2">{repo.description}</p>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-yellow-400">⭐ {repo.stars}</span>
              <span className="text-cyan-400">🔱 {repo.forks}</span>
              <span className={colorClass}>{repo.language}</span>
            </div>
            <div className="mt-2 text-xs text-cyber-primary">
              Click to open in GitHub →
            </div>
          </div>
        </Html>
      )}
    </group>
  );
});

GitHubNode.displayName = 'GitHubNode';
