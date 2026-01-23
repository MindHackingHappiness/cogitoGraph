import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useRef, useEffect } from 'react';
import {
  OrbitControls,
  Environment,
  Stars,
  Html
} from '@react-three/drei';
import { DataNodes } from './spatial/DataNodes';
import { HolographicUI } from './spatial/HolographicUI';
import { SpatialControls } from './spatial/SpatialControls';
import { MetricsOverlay } from './spatial/MetricsOverlay';
import { ParticleField } from './spatial/ParticleField';
import { CyberGrid } from './spatial/CyberGrid';
import { FloatingImagePanels } from './spatial/FloatingImagePanels';
import { StatsMonitor } from './StatsMonitor';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { Card } from '@/components/ui/card';

interface XRVisualizationRoomProps {
  className?: string;
}

export const XRVisualizationRoom = ({ className }: XRVisualizationRoomProps) => {
  const { isSupported, errorMessage } = useWebGLSupport();
  const [isVRMode, setIsVRMode] = useState(false);
  const [dataIntensity, setDataIntensity] = useState(3);
  const [currentScene, setCurrentScene] = useState<'cognitive' | 'neural' | 'quantum'>('cognitive');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keyboard controls hook
  useKeyboardControls({
    dataIntensity,
    onIntensityChange: setDataIntensity,
    currentScene,
    onSceneChange: setCurrentScene
  });

  useEffect(() => {
    // Set ultra-high pixel ratio for maximum sharpness
    if (canvasRef.current) {
      Math.min(window.devicePixelRatio * 2, 3);
      canvasRef.current.style.imageRendering = 'crisp-edges';
    }
  }, []);

  // Loading state
  if (isSupported === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Card className="spatial-panel neon-border p-8">
          <div className="hologram-text text-xl animate-pulse">
            DETECTING WebGL CAPABILITIES...
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (isSupported === false) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Card className="spatial-panel neon-border p-8 max-w-lg">
          <div className="flex flex-col items-center gap-4">
            <h1 className="hologram-text text-2xl font-bold text-cyber-error">
              WebGL NOT SUPPORTED
            </h1>
            <p className="text-muted-foreground text-center">
              {errorMessage || 'Your browser or device does not support WebGL, which is required for this 3D visualization.'}
            </p>
            <div className="text-sm text-muted-foreground">
              Please try:
              <ul className="list-disc list-inside mt-2">
                <li>Updating your graphics drivers</li>
                <li>Using a modern browser (Chrome, Firefox, Edge)</li>
                <li>Enabling hardware acceleration in browser settings</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden cyber-grid ${className}`}>
      {/* StatsMonitor - FPS Counter */}
      <StatsMonitor />

      {/* Holographic UI Overlay */}
      <HolographicUI
        isVRMode={isVRMode}
        onVRToggle={setIsVRMode}
        dataIntensity={dataIntensity}
        onIntensityChange={setDataIntensity}
        currentScene={currentScene}
        onSceneChange={setCurrentScene}
      />
      
      {/* Spatial Controls */}
      <SpatialControls 
        dataIntensity={dataIntensity}
        onIntensityChange={setDataIntensity}
      />
      
      {/* Metrics Overlay */}
      <MetricsOverlay />
      
      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        dpr={[1, 3]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          precision: "highp"
        }}
        camera={{ 
          position: [0, 0, 10], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        className="absolute inset-0"
      >
        <Suspense fallback={
          <Html center>
            <div className="hologram-text text-2xl animate-pulse">
              INITIALIZING COGNITIVE SPACE...
            </div>
          </Html>
        }>
          {/* Environment */}
          <Environment preset="night" />
          <Stars 
            radius={300} 
            depth={60} 
            count={10000} 
            factor={8} 
            saturation={1} 
            fade={true}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} color="#00ffff" />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffff00" />
          <spotLight
            position={[0, 20, 0]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            color="#00ffff"
            castShadow
          />
          
          {/* Background Particle Field */}
          <ParticleField count={dataIntensity * 2000} />
          
          {/* Cyber Grid Floor */}
          <CyberGrid />
          
          {/* Floating Image Panels */}
          <FloatingImagePanels 
            intensity={dataIntensity}
            scene={currentScene}
          />
          
          {/* Main Data Visualization */}
          <DataNodes 
            intensity={dataIntensity} 
            scene={currentScene}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={1.5}
            panSpeed={2}
            rotateSpeed={1}
          />
        </Suspense>
      </Canvas>
      
      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-cyber-primary to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 50}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};