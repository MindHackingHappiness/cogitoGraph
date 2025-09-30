import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count: number;
}

export const ParticleField = ({ count }: ParticleFieldProps) => {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Cyber colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0;     // R
        colors[i * 3 + 1] = 1; // G (cyan)
        colors[i * 3 + 2] = 1; // B
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 1;     // R (magenta)
        colors[i * 3 + 1] = 0; // G
        colors[i * 3 + 2] = 1; // B
      } else {
        colors[i * 3] = 1;     // R (yellow)
        colors[i * 3 + 1] = 1; // G
        colors[i * 3 + 2] = 0; // B
      }
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, colors, sizes };
  }, [count]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      
      // Animate particle sizes
      const sizes = mesh.current.geometry.attributes.size;
      if (sizes) {
        for (let i = 0; i < count; i++) {
          sizes.array[i] = particles.sizes[i] + Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.5;
        }
        sizes.needsUpdate = true;
      }
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles.positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={particles.colors}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={particles.sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};