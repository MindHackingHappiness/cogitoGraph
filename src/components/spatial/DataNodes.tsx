import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import { Sphere, Line, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

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

export const DataNodes = ({ intensity, scene }: DataNodesProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  // Generate nodes based on scene type and intensity
  const generateNodes = useMemo(() => {
    const nodeCount = intensity * 20;
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
        size: 0.1 + Math.random() * 0.5,
        color: scene === 'cognitive' ? '#00ffff' : 
               scene === 'neural' ? '#ff00ff' : '#ffff00',
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
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * newNodes.length);
        if (targetIndex !== i) {
          node.connections.push(newNodes[targetIndex].id);
        }
      }
    });
    
    return newNodes;
  }, [intensity, scene]);

  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      
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

  const NodeComponent = ({ node, index }: { node: Node; index: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.scale.setScalar(node.size + Math.sin(time * 2 + index) * 0.2);
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
          position={[0, node.size + 0.5, 0]}
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
          <ringGeometry args={[node.size * 2, node.size * 2.2, 32]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.3 + Math.sin(time * 3 + index) * 0.2}
          />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {generateNodes.map((node, index) => (
        <NodeComponent key={node.id} node={node} index={index} />
      ))}

      {/* Connection Lines */}
      {generateNodes.map((node) =>
        node.connections.map((connectionId) => {
          const targetNode = generateNodes.find(n => n.id === connectionId);
          if (!targetNode) return null;
          
          return (
            <Line
              key={`${node.id}-${connectionId}`}
              points={[node.position, targetNode.position]}
              color="#ffffff"
              transparent
              opacity={0.3}
              lineWidth={1}
            />
          );
        })
      )}
      
      {/* Data streams */}
      {Array.from({ length: intensity * 5 }).map((_, i) => (
        <group key={`stream-${i}`}>
          <Line
            points={[
              [Math.sin(time + i) * 15, Math.cos(time + i) * 5, Math.sin(time * 0.5 + i) * 10],
              [Math.sin(time + i + 1) * 15, Math.cos(time + i + 1) * 5, Math.sin(time * 0.5 + i + 1) * 10]
            ]}
            color="#00ffff"
            transparent
            opacity={0.6}
            lineWidth={2}
          />
        </group>
      ))}
    </group>
  );
};