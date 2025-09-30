import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Image } from '@react-three/drei';
import * as THREE from 'three';
import holoPanelA from '@/assets/holo-panel-a.png';
import neuralVizB from '@/assets/neural-viz-b.png';
import quantumFieldC from '@/assets/quantum-field-c.png';

interface FloatingImagePanelsProps {
  intensity: number;
  scene: 'cognitive' | 'neural' | 'quantum';
}

export const FloatingImagePanels = ({ intensity, scene }: FloatingImagePanelsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const imageData = useMemo(() => [
    { 
      src: holoPanelA, 
      position: [-8, 3, -5], 
      scale: 0.8 + intensity * 0.1,
      name: 'HOLO-INTERFACE-A'
    },
    { 
      src: neuralVizB, 
      position: [8, -2, -3], 
      scale: 0.6 + intensity * 0.15,
      name: 'NEURAL-VIZ-B'
    },
    { 
      src: quantumFieldC, 
      position: [0, 5, -8], 
      scale: 0.7 + intensity * 0.12,
      name: 'QUANTUM-FIELD-C'
    }
  ], [intensity]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 * intensity;
    }
  });

  return (
    <group ref={groupRef}>
      {imageData.map((img, index) => {
        const isActive = (scene === 'cognitive' && index === 0) || 
                        (scene === 'neural' && index === 1) || 
                        (scene === 'quantum' && index === 2);
        
        return (
          <group 
            key={index}
            position={img.position as [number, number, number]}
            scale={isActive ? img.scale * 1.3 : img.scale}
          >
            {/* Glowing frame */}
            <mesh>
              <planeGeometry args={[6.2, 3.7, 1]} />
              <meshBasicMaterial 
                color={isActive ? "#00ffff" : "#ffffff"} 
                transparent 
                opacity={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Main image */}
            <Image
              url={img.src}
              scale={[6, 3.375]}
              transparent
              opacity={isActive ? 1 : 0.7}
            />
            
            {/* Floating label */}
            <Html 
              position={[0, -2.5, 0]}
              center
              distanceFactor={10}
            >
              <div className="hologram-text text-xs font-mono px-2 py-1 bg-black/50 rounded border border-cyber-accent">
                {img.name}
              </div>
            </Html>
            
            {/* Particle effects around active image */}
            {isActive && (
              <pointLight 
                position={[0, 0, 1]} 
                color="#00ffff" 
                intensity={intensity * 0.5}
                distance={10}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};