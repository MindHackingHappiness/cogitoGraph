import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import { Sphere, Line, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import React from 'react';
import { COLORS, NODE_CONFIG, ANIMATION, INTENSITY, SCENE_TYPES, UI } from '@/constants/config';

interface Node {
  id: string;
  position: [number, number, number];
  size: number;
  color: string;
  type: 'api' | 'cache' | 'neural' | 'quantum' | 'data';
  connections: string[];
  intensity: number;
  metadata: {
    tokens?: number;
    cached?: boolean;
    savings?: number;
    performance?: number;
  };
}

interface DataNodesProps {
  intensity: number;
  scene: 'cognitive' | 'neural' | 'quantum';
}

const DataNodes = ({ intensity, scene }: DataNodesProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  // Generate nodes based on scene type and intensity
  const generateNodes = useMemo(() => {
    const nodeCount = intensity * INTENSITY.NODES_PER_UNIT;
    const newNodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 5 + Math.random() * 10;
      const height = (Math.random() - 0.5) * 10;
      
      newNodes.push({
        id: `node-${i}`,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        size: NODE_CONFIG.MIN_SIZE + Math.random() * NODE_CONFIG.SIZE_RANGE,
        color: scene === SCENE_TYPES.COGNITIVE ? COLORS.COGNITIVE :
               scene === SCENE_TYPES.NEURAL ? COLORS.NEURAL : COLORS.QUANTUM,
        type: ['api', 'cache', 'neural', 'quantum', 'data'][Math.floor(Math.random() * 5)] as Node['type'],
        connections: [],
        intensity: Math.random(),
        metadata: {
          tokens: Math.floor(Math.random() * 1000),
          cached: Math.random() > 0.5,
          savings: Math.floor(Math.random() * 500),
          performance: Math.random() * 100
        }
      });
    }
    
    // Generate connections
    newNodes.forEach((node, i) => {
      const connectionCount = NODE_CONFIG.CONNECTIONS_PER_NODE;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * newNodes.length);
        if (targetIndex !== i) {
          node.connections.push(newNodes[targetIndex].id);
        }
      }
    });
    
    return newNodes;
  }, [intensity, scene]);

  // Batch connection lines into single geometry for performance
  const connectionGeometry = useMemo(() => {
    const linePositions: number[] = [];

    generateNodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = generateNodes.find(n => n.id === connectionId);
        if (targetNode) {
          linePositions.push(
            ...node.position,
            ...targetNode.position
          );
        }
      });
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    return geometry;
  }, [generateNodes]);

  useFrame((state) => {
    setTime(state.clock.elapsedTime);

    if (groupRef.current) {
      groupRef.current.rotation.y = time * ANIMATION.GROUP_ROTATION_SPEED;

      // Animate individual nodes
      groupRef.current.children.forEach((child, i) => {
        if (child.type === 'Mesh') {
          child.position.y += Math.sin(time + i) * 0.01;
          child.rotation.x = time + i;
          child.rotation.z = time * 0.5 + i;
        }
      });
    }
  });

  const NodeComponent = React.memo(({ node, index }: { node: Node; index: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.scale.setScalar(
          node.size + Math.sin(time * ANIMATION.NODE_SCALE_SPEED + index) * ANIMATION.NODE_SCALE_AMPLITUDE
        );
      }
    });

    return (
      <group position={node.position}>
        <Sphere ref={meshRef} args={[node.size, 16, 16]}>
          <meshPhongMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>

        {/* Node Label */}
        <Html
          position={[0, node.size + UI.NODE_LABEL_OFFSET, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="spatial-panel px-2 py-1 text-xs text-cyber-primary">
            <div className="font-mono font-bold">{node.type.toUpperCase()}</div>
            <div className="text-[10px] opacity-75">
              {node.metadata.tokens}T | {node.metadata.performance?.toFixed(1)}%
            </div>
            {node.metadata.cached && (
              <div className="text-[8px] text-cyber-accent">CACHED</div>
            )}
          </div>
        </Html>

        {/* Pulsing ring */}
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[
            node.size * NODE_CONFIG.RING_SIZE_MULTIPLIER,
            node.size * (NODE_CONFIG.RING_SIZE_MULTIPLIER + NODE_CONFIG.RING_WIDTH),
            32
          ]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.3 + Math.sin(time * ANIMATION.RING_PULSE_SPEED + index) * ANIMATION.RING_PULSE_AMPLITUDE}
          />
        </mesh>
      </group>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison: only re-render if node.id or index changes
    return prevProps.node.id === nextProps.node.id && prevProps.index === nextProps.index;
  });

  NodeComponent.displayName = 'NodeComponent';

  return (
    <group ref={groupRef}>
      {generateNodes.map((node, index) => (
        <NodeComponent key={node.id} node={node} index={index} />
      ))}

      {/* Connection Lines - Batched for performance */}
      <lineSegments geometry={connectionGeometry}>
        <lineBasicMaterial
          color={COLORS.WHITE}
          transparent
          opacity={0.3}
        />
      </lineSegments>
      
      {/* Data streams */}
      {Array.from({ length: intensity * 5 }).map((_, i) => (
        <group key={`stream-${i}`}>
          <Line
            points={[
              [Math.sin(time + i) * 15, Math.cos(time + i) * 5, Math.sin(time * ANIMATION.GRID_FLOAT_SPEED + i) * 10],
              [Math.sin(time + i + 1) * 15, Math.cos(time + i + 1) * 5, Math.sin(time * ANIMATION.GRID_FLOAT_SPEED + i + 1) * 10]
            ]}
            color={COLORS.CYAN}
            transparent
            opacity={0.6}
            lineWidth={2}
          />
        </group>
      ))}
    </group>
  );
};

export const DataNodesMemo = React.memo(DataNodes, (prevProps, nextProps) => {
  return prevProps.intensity === nextProps.intensity && prevProps.scene === nextProps.scene;
});

DataNodesMemo.displayName = 'DataNodes';

// Export with memo for backward compatibility
export { DataNodesMemo as DataNodes };