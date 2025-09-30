import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CyberGrid = () => {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      // Subtle animation
      gridRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  
  return (
    <group ref={gridRef} position={[0, -10, 0]}>
      {/* Main grid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
      
      {/* Glowing grid lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 20, 20]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          wireframe={true}
        />
      </mesh>
      
      {/* Center focal point */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0, 2, 0.1, 8]} />
        <meshBasicMaterial
          color="#ff00ff"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Grid intersection points */}
      {Array.from({ length: 25 }).map((_, i) => {
        const x = (i % 5 - 2) * 10;
        const z = (Math.floor(i / 5) - 2) * 10;
        
        return (
          <mesh key={i} position={[x, 0.2, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              color="#ffff00"
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
      
      {/* Data flow streams */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 20;
        const z = Math.sin(angle) * 20;
        
        return (
          <mesh key={`stream-${i}`} position={[x, 0, z]}>
            <cylinderGeometry args={[0.05, 0.05, 5]} />
            <meshBasicMaterial
              color="#00ffff"
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
};