# cogitoGraph Bug Fixes & Performance Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all 5 identified bugs and implement 7 performance optimizations to achieve 60 FPS at maximum intensity (8X).

**Architecture:** Systematic bug fixing first (A), then performance optimization (B), followed by 1-2 showcase features. Using React.memo, useMemo, useCallback, and batch rendering to reduce unnecessary re-renders from ~9,600 component allocations/sec to <100.

**Tech Stack:** React 18.3.1, Three.js r180, @react-three/fiber 8.18.0, TypeScript 5.8.3, Vite 5.4.19

---

## Task 1: Fix Code Duplication in useKeyboardControls

**Files:**
- Modify: `src/hooks/useKeyboardControls.tsx:52-72`

**Step 1: Remove duplicate scenes array**

Replace the duplicate `scenes` array definition with a single constant at the top of the component:

```typescript
export const useKeyboardControls = ({
  dataIntensity,
  onIntensityChange,
  currentScene,
  onSceneChange
}: UseKeyboardControlsProps) => {
  const { toast } = useToast();

  // Define scenes once - DRY principle
  const scenes = ['cognitive', 'neural', 'quantum'] as const;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // ... rest of code ...

      case 'ArrowLeft':
        const currentIndex = scenes.indexOf(currentScene);
        const prevScene = scenes[(currentIndex - 1 + scenes.length) % scenes.length];
        onSceneChange(prevScene);
        // ...

      case 'ArrowRight':
        const currentIndexRight = scenes.indexOf(currentScene);
        const nextScene = scenes[(currentIndexRight + 1) % scenesRight.length];
        onSceneChange(nextScene);
        // ...
```

Remove the duplicate `scenes` and `scenesRight` arrays. Use the single `scenes` constant for both ArrowLeft and ArrowRight cases.

**Step 2: Verify TypeScript compilation**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add src/hooks/useKeyboardControls.tsx
git commit -m "fix: remove duplicate scenes array in useKeyboardControls

- Extract scenes constant to top of component
- Remove duplicate scenesRight array
- Improve maintainability and DRY adherence
```

---

## Task 2: Fix Type Safety Issue in HolographicUI

**Files:**
- Modify: `src/components/spatial/HolographicUI.tsx:78-89`

**Step 1: Add proper type annotation**

Replace the `as any` cast with proper typing:

```typescript
// Change this:
onClick={() => onSceneChange(id as any)}

// To this:
onClick={() => onSceneChange(id as 'cognitive' | 'neural' | 'quantum')}
```

**Better yet**, define a type alias at the top of the file:

```typescript
type SceneType = 'cognitive' | 'neural' | 'quantum';

interface HolographicUIProps {
  isVRMode: boolean;
  onVRToggle: (enabled: boolean) => void;
  dataIntensity: number;
  onIntensityChange: (value: number) => void;
  currentScene: SceneType;
  onSceneChange: (scene: SceneType) => void;
}
```

Then update the button click handler:

```typescript
{[
  { id: 'cognitive' as SceneType, icon: Brain, label: 'COGNITIVE SPACE' },
  { id: 'neural' as SceneType, icon: Activity, label: 'NEURAL NETWORK' },
  { id: 'quantum' as SceneType, icon: Atom, label: 'QUANTUM FIELD' }
].map(({ id, icon: Icon, label }) => (
  <Button
    key={id}
    variant={currentScene === id ? "default" : "outline"}
    size="sm"
    onClick={() => onSceneChange(id)}
    className="justify-start neon-border"
  >
```

**Step 2: Verify TypeScript compilation**

Run: `npm run build`
Expected: No TypeScript errors, no `any` types

**Step 3: Commit**

```bash
git add src/components/spatial/HolographicUI.tsx
git commit -m "fix: remove 'as any' type cast in HolographicUI

- Add SceneType type alias
- Properly type scene button IDs
- Eliminate unsafe type assertions
```

---

## Task 3: Fix Redundant State Synchronization in DataNodes

**Files:**
- Modify: `src/components/spatial/DataNodes.tsx:28-81`

**Step 1: Remove unnecessary useEffect**

The current code has redundant state synchronization:

```typescript
const [nodes, setNodes] = useState<Node[]>([]);

// Generate nodes based on scene type and intensity
const generateNodes = useMemo(() => {
  // ... generates nodes array
}, [intensity, scene]);

useEffect(() => {
  setNodes(generateNodes);
}, [generateNodes]); // ❌ This causes extra render!
```

Fix by removing the state and useEffect entirely:

```typescript
// Remove useState line
// const [nodes, setNodes] = useState<Node[]>([]);

// Generate nodes based on scene type and intensity
const generateNodes = useMemo(() => {
  const nodeCount = intensity * 20;
  const newNodes: Node[] = [];

  // ... existing generation code ...

  return newNodes;
}, [intensity, scene]);

// Remove useEffect entirely

// Use generateNodes directly in render:
return (
  <group ref={groupRef}>
    {generateNodes.map((node, index) => (
      <NodeComponent key={node.id} node={node} index={index} />
    ))}
```

**Step 2: Verify application still works**

Run: `npm run dev`
Expected: Nodes render and update when intensity/scene changes

**Step 3: Commit**

```bash
git add src/components/spatial/DataNodes.tsx
git commit -m "refactor: remove redundant state synchronization in DataNodes

- Use useMemo result directly instead of syncing to state
- Eliminate unnecessary useEffect and extra render cycle
- Improve performance by reducing state updates
```

---

## Task 4: Verify Asset Path Resolution

**Files:**
- Modify: `src/components/spatial/FloatingImagePanels.tsx:5-7`
- Check: `vite.config.ts`

**Step 1: Check current asset imports**

Verify the imports in `FloatingImagePanels.tsx`:

```typescript
import holoPanelA from '@/assets/holo-panel-a.png';
import neuralVizB from '@/assets/neural-viz-b.png';
import quantumFieldC from '@/assets/quantum-field-c.png';
```

**Step 2: Verify Vite alias configuration**

Check `vite.config.ts` has the `@` alias configured:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

If the alias is missing, add it.

**Step 3: Test asset loading**

Run: `npm run dev`
Expected: Images load without 404 errors in browser console

**Step 4: Add fallback if alias not configured**

If the alias doesn't work, change to relative imports:

```typescript
import holoPanelA from '../../assets/holo-panel-a.png';
import neuralVizB from '../../assets/neural-viz-b.png';
import quantumFieldC from '../../assets/quantum-field-c.png';
```

**Step 5: Commit**

```bash
git add src/components/spatial/FloatingImagePanels.tsx vite.config.ts
git commit -m "fix: ensure asset path resolution works correctly

- Verify @ alias is configured in vite.config.ts
- Test image imports load correctly
- Add fallback to relative imports if needed
```

---

## Task 5: Add Error Boundary for Three.js Components

**Files:**
- Create: `src/components/ErrorBoundary.tsx`
- Modify: `src/App.tsx:11-25`

**Step 1: Create ErrorBoundary component**

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <Card className="spatial-panel neon-border p-8 max-w-lg">
            <div className="flex flex-col items-center gap-4">
              <AlertTriangle className="w-16 h-16 text-cyber-error" />
              <h1 className="hologram-text text-2xl font-bold">RENDER ERROR</h1>
              <p className="text-muted-foreground text-center">
                The 3D visualization encountered an error. This may be due to:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>WebGL not supported on this device</li>
                <li>Graphics driver issues</li>
                <li>Insufficient GPU memory</li>
              </ul>
              {this.state.error && (
                <div className="text-xs font-mono text-cyber-warning bg-black/50 p-2 rounded w-full overflow-auto">
                  {this.state.error.message}
                </div>
              )}
              <Button
                onClick={() => window.location.reload()}
                className="neon-border"
              >
                Reload Application
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Step 2: Wrap XRVisualizationRoom with ErrorBoundary**

```typescript
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

**Step 3: Test ErrorBoundary**

Add a test button that throws an error temporarily, or test by breaking a component. Verify the error screen displays.

**Step 4: Commit**

```bash
git add src/components/ErrorBoundary.tsx src/App.tsx
git commit -m "feat: add error boundary for graceful failure handling

- Create ErrorBoundary component for catching React errors
- Wrap application routes with error boundary
- Provide user-friendly error message with reload option
- Prevents app crash on WebGL/component errors
```

---

## Task 6: Add React.memo to Expensive Components

**Files:**
- Modify: `src/components/spatial/DataNodes.tsx:100-152`
- Modify: `src/components/spatial/ParticleField.tsx:9-97`
- Modify: `src/components/spatial/HolographicUI.tsx:25-179`
- Modify: `src/components/spatial/MetricsOverlay.tsx:14-201`

**Step 1: Memoize NodeComponent in DataNodes**

```typescript
// At the bottom of DataNodes.tsx, wrap the component:
const NodeComponent = React.memo(({ node, index }: { node: Node; index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(node.size + Math.sin(time * 2 + index) * 0.2);
    }
  });

  return (
    <group position={node.position}>
      {/* ... existing component code ... */}
    </group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if node.id or index changes
  return prevProps.node.id === nextProps.node.id && prevProps.index === nextProps.index;
});

NodeComponent.displayName = 'NodeComponent';
```

**Step 2: Memoize DataNodes export**

```typescript
// At the bottom of DataNodes.tsx, wrap the export:
export const DataNodes = React.memo(({ intensity, scene }: DataNodesProps) => {
  // ... existing component code ...
}, (prevProps, nextProps) => {
  return prevProps.intensity === nextProps.intensity && prevProps.scene === nextProps.scene;
});

DataNodes.displayName = 'DataNodes';
```

**Step 3: Memoize ParticleField**

```typescript
export const ParticleField = React.memo(({ count }: ParticleFieldProps) => {
  // ... existing code ...
});

ParticleField.displayName = 'ParticleField';
```

**Step 4: Memoize HolographicUI**

```typescript
export const HolographicUI = React.memo(({
  isVRMode,
  onVRToggle,
  dataIntensity,
  onIntensityChange,
  currentScene,
  onSceneChange
}: HolographicUIProps) => {
  // ... existing code ...
}, (prevProps, nextProps) => {
  return (
    prevProps.isVRMode === nextProps.isVRMode &&
    prevProps.dataIntensity === nextProps.dataIntensity &&
    prevProps.currentScene === nextProps.currentScene
  );
  // Note: intentionally excluding callback functions from comparison
});

HolographicUI.displayName = 'HolographicUI';
```

**Step 5: Memoize MetricsOverlay**

```typescript
export const MetricsOverlay = React.memo(() => {
  // ... existing code ...
});

MetricsOverlay.displayName = 'MetricsOverlay';
```

**Step 6: Verify no visual regressions**

Run: `npm run dev`
Expected: All UI elements still render and update correctly

**Step 7: Commit**

```bash
git add src/components/spatial/DataNodes.tsx src/components/spatial/ParticleField.tsx src/components/spatial/HolographicUI.tsx src/components/spatial/MetricsOverlay.tsx
git commit -m "perf: add React.memo to expensive spatial components

- Memoize NodeComponent with custom comparison
- Memoize DataNodes, ParticleField, HolographicUI, MetricsOverlay
- Prevent unnecessary re-renders when parent state changes
- Estimated 60-80% reduction in component re-renders
```

---

## Task 7: Optimize Particle Size Animation

**Files:**
- Modify: `src/components/spatial/ParticleField.tsx:49-63`

**Step 1: Reduce update frequency**

Currently, ALL particle sizes are updated EVERY frame. Optimize by:

```typescript
useFrame((state) => {
  if (mesh.current) {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;

    // Only update every 10th frame to reduce CPU usage
    if (Math.floor(state.clock.elapsedTime * 60) % 10 === 0) {
      const sizes = mesh.current.geometry.attributes.size;
      if (sizes) {
        for (let i = 0; i < count; i++) {
          sizes.array[i] = particles.sizes[i] + Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.5;
        }
        sizes.needsUpdate = true;
      }
    }
  }
});
```

**Step 2: Better yet - use a shader**

Create a custom shader material for GPU-based animation:

```typescript
import { useMemo } from 'react';

const particleVertexShader = `
  attribute float size;
  varying float vSize;
  uniform float uTime;

  void main() {
    vSize = size + sin(uTime * 2.0 + position.x * 0.1) * 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = vSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying float vSize;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 - r * 2.0);
  }
`;

export const ParticleField = ({ count }: ParticleFieldProps) => {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    // ... existing particle generation code ...
  }, [count]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      material.uniforms.uTime.value = state.clock.elapsedTime;
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
      <primitive object={material} />
    </points>
  );
};
```

**Step 3: Test performance**

Before optimization: Check FPS at 8X intensity (should be ~15-25 FPS)
After optimization: Should see ~40-50 FPS improvement

**Step 4: Commit**

```bash
git add src/components/spatial/ParticleField.tsx
git commit -m "perf: optimize particle size animation with GPU shader

- Move size animation from CPU to GPU with custom shader
- Eliminate per-frame CPU loops over 16,000 particles
- Estimated 40-50 FPS improvement at maximum intensity
- Reduces main thread blocking
```

---

## Task 8: Fix Fake Metrics Random Generation

**Files:**
- Modify: `src/components/spatial/HolographicUI.tsx:154-162`

**Step 1: Move random generation to state/interval**

```typescript
// In HolographicUI.tsx
import { useState, useEffect } from 'react';

export const HolographicUI = ({
  isVRMode,
  onVRToggle,
  dataIntensity,
  onIntensityChange,
  currentScene,
  onSceneChange
}: HolographicUIProps) => {
  const [perfMetrics, setPerfMetrics] = useState({
    gpu: 75,
    ram: 45,
    net: 120
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPerfMetrics(prev => ({
        gpu: Math.max(30, Math.min(95, prev.gpu + (Math.random() - 0.5) * 10)),
        ram: Math.max(30, Math.min(80, prev.ram + (Math.random() - 0.5) * 5)),
        net: Math.max(50, Math.min(200, prev.net + (Math.random() - 0.5) * 20))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Then in the JSX:
  <div className="absolute bottom-4 right-4 z-40">
    <Card className="spatial-panel neon-border p-3">
      <div className="text-xs font-mono space-y-1">
        <div className="text-cyber-primary">GPU: {perfMetrics.gpu.toFixed(1)}%</div>
        <div className="text-cyber-accent">RAM: {perfMetrics.ram.toFixed(1)}%</div>
        <div className="text-cyber-secondary">NET: {perfMetrics.net.toFixed(0)}ms</div>
      </div>
    </Card>
  </div>
```

**Step 2: Commit**

```bash
git add src/components/spatial/HolographicUI.tsx
git commit -m "fix: prevent excessive re-renders from inline random generation

- Move random metrics to useState with 1-second interval
- Prevents new random numbers on every render
- Reduces unnecessary DOM updates
```

---

## Task 9: Add WebGL Detection and Fallback

**Files:**
- Create: `src/hooks/useWebGLSupport.ts`
- Modify: `src/components/XRVisualizationRoom.tsx:30-51`

**Step 1: Create WebGL detection hook**

```typescript
// src/hooks/useWebGLSupport.ts
import { useState, useEffect } from 'react';

export const useWebGLSupport = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) {
          setErrorMessage('WebGL is not supported in this browser');
          setIsSupported(false);
          return false;
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          console.log('WebGL Renderer:', renderer);
        }

        setIsSupported(true);
        return true;
      } catch (e) {
        setErrorMessage(`WebGL initialization failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        setIsSupported(false);
        return false;
      }
    };

    checkWebGL();
  }, []);

  return { isSupported, errorMessage };
};
```

**Step 2: Add loading and error states to XRVisualizationRoom**

```typescript
// In XRVisualizationRoom.tsx
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { Card } from '@/components/ui/card';

export const XRVisualizationRoom = ({ className }: XRVisualizationRoomProps) => {
  const { isSupported, errorMessage } = useWebGLSupport();
  const [isVRMode, setIsVRMode] = useState(false);
  const [dataIntensity, setDataIntensity] = useState(3);
  const [currentScene, setCurrentScene] = useState<'cognitive' | 'neural' | 'quantum'>('cognitive');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ... keyboard controls hook ...

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

  // ... existing Canvas and 3D scene code ...
```

**Step 3: Test with WebGL disabled**

In Chrome DevTools: Performance → Disable WebGL
Verify the fallback UI displays

**Step 4: Commit**

```bash
git add src/hooks/useWebGLSupport.ts src/components/XRVisualizationRoom.tsx
git commit -m "feat: add WebGL detection and graceful fallback

- Create useWebGLSupport hook to detect WebGL availability
- Show loading state while detecting capabilities
- Display helpful error message if WebGL unavailable
- Prevent app crash on unsupported devices
```

---

## Task 10: Extract Constants to Configuration File

**Files:**
- Create: `src/constants/config.ts`

**Step 1: Create constants file**

```typescript
// src/constants/config.ts

// Scene Configuration
export const SCENE_TYPES = {
  COGNITIVE: 'cognitive',
  NEURAL: 'neural',
  QUANTUM: 'quantum'
} as const;

export type SceneType = typeof SCENE_TYPES[keyof typeof SCENE_TYPES];

// Color Palette
export const COLORS = {
  CYAN: '#00ffff',
  MAGENTA: '#ff00ff',
  YELLOW: '#ffff00',
  WHITE: '#ffffff',
  COGNITIVE: '#00ffff',
  NEURAL: '#ff00ff',
  QUANTUM: '#ffff00'
} as const;

// Node Configuration
export const NODE_CONFIG = {
  MIN_SIZE: 0.1,
  MAX_SIZE: 0.6,
  SIZE_RANGE: 0.5,
  BASE_INTENSITY: 20,
  CONNECTIONS_PER_NODE: 3,
  RING_SIZE_MULTIPLIER: 2.0,
  RING_WIDTH: 0.2
} as const;

// Animation Timing
export const ANIMATION = {
  GROUP_ROTATION_SPEED: 0.1,
  NODE_SCALE_SPEED: 2.0,
  NODE_SCALE_AMPLITUDE: 0.2,
  RING_PULSE_SPEED: 3.0,
  RING_PULSE_AMPLITUDE: 0.2,
  PARTICLE_ROTATION_SPEED: 0.05,
  GRID_FLOAT_SPEED: 0.5,
  GRID_FLOAT_AMPLITUDE: 0.2
} as const;

// Intensity Configuration
export const INTENSITY = {
  MIN: 1,
  MAX: 8,
  DEFAULT: 3,
  NODES_PER_UNIT: 20,
  PARTICLES_PER_UNIT: 2000
} as const;

// Performance Configuration
export const PERFORMANCE = {
  TARGET_FPS: 60,
  PIXEL_RATIO_MIN: 1,
  PIXEL_RATIO_MAX: 3,
  PARTICLE_UPDATE_INTERVAL: 10, // frames
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000
} as const;

// UI Configuration
export const UI = {
  NODE_LABEL_OFFSET: 0.5,
  TOAST_DURATION: 3000,
  METRICS_UPDATE_INTERVAL: 1000
} as const;
```

**Step 2: Update DataNodes to use constants**

```typescript
// In DataNodes.tsx
import { COLORS, NODE_CONFIG, ANIMATION, INTENSITY } from '@/constants/config';

export const DataNodes = ({ intensity, scene }: DataNodesProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const generateNodes = useMemo(() => {
    const nodeCount = intensity * INTENSITY.NODES_PER_UNIT;
    const newNodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 5 + Math.random() * 10;
      const height = (Math.random() - 0.5) * 10;

      const sceneColor = scene === SCENE_TYPES.COGNITIVE ? COLORS.COGNITIVE :
                        scene === SCENE_TYPES.NEURAL ? COLORS.NEURAL : COLORS.QUANTUM;

      newNodes.push({
        id: `node-${i}`,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        size: NODE_CONFIG.MIN_SIZE + Math.random() * NODE_CONFIG.SIZE_RANGE,
        color: sceneColor,
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
      for (let j = 0; j < NODE_CONFIG.CONNECTIONS_PER_NODE; j++) {
        const targetIndex = Math.floor(Math.random() * newNodes.length);
        if (targetIndex !== i) {
          node.connections.push(newNodes[targetIndex].id);
        }
      }
    });

    return newNodes;
  }, [intensity, scene]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * ANIMATION.GROUP_ROTATION_SPEED;

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
        const time = performance.now() / 1000;
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

        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              node.size * NODE_CONFIG.RING_SIZE_MULTIPLIER,
              node.size * NODE_CONFIG.RING_SIZE_MULTIPLIER + NODE_CONFIG.RING_WIDTH,
              32
            ]}
          />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.3 + Math.sin(time * ANIMATION.RING_PULSE_SPEED + index) * ANIMATION.RING_PULSE_AMPLITUDE}
          />
        </mesh>
      </group>
    );
  });

  NodeComponent.displayName = 'NodeComponent';

  // ... rest of component
};
```

**Step 3: Update other components similarly**

Update `ParticleField.tsx`, `HolographicUI.tsx`, etc. to use constants.

**Step 4: Commit**

```bash
git add src/constants/config.ts src/components/spatial/DataNodes.tsx
git commit -m "refactor: extract magic numbers to constants file

- Create centralized config.ts with all constants
- Update DataNodes to use named constants
- Improve maintainability and prevent typos
- Make configuration changes easier in one place
```

---

## Task 11: Optimize Line Rendering with InstancedMesh

**Files:**
- Modify: `src/components/spatial/DataNodes.tsx:161-177`

**Step 1: Replace individual Line components with InstancedMesh**

Currently, each connection is a separate Line component. Optimize by using a single LineSegments with all connections:

```typescript
// In DataNodes.tsx, after the generateNodes useMemo:
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

// Then in the render, replace all the individual Line components with:
<lineSegments geometry={connectionGeometry}>
  <lineBasicMaterial
    color="#ffffff"
    transparent
    opacity={0.3}
    linewidth={1}
  />
</lineSegments>
```

**Step 2: Commit**

```bash
git add src/components/spatial/DataNodes.tsx
git commit -m "perf: batch connection lines into single geometry

- Replace 480 individual Line components with one LineSegments
- Reduce draw calls from 480 to 1
- Improve rendering performance significantly
- Maintain same visual appearance
```

---

## Task 12: Add Real FPS Counter with Stats.js

**Files:**
- Install: `npm install --save-dev @types/three-stats` (or just `stats.js`)
- Create: `src/components/StatsMonitor.tsx`
- Modify: `src/components/XRVisualizationRoom.tsx:75-150`

**Step 1: Install stats.js**

```bash
npm install --save-dev stats.js
npm install --save-dev @types/stats.js
```

**Step 2: Create StatsMonitor component**

```typescript
// src/components/StatsMonitor.tsx
import { useEffect, useRef } from 'react';
import Stats from 'stats.js';

export const StatsMonitor = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInstance = useRef<Stats | null>(null);

  useEffect(() => {
    if (!statsRef.current || statsInstance.current) return;

    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb

    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '80px';
    stats.dom.style.left = '4px';
    stats.dom.style.zIndex = '1000';
    stats.dom.style.opacity = '0.8';

    statsRef.current.appendChild(stats.dom);
    statsInstance.current = stats;

    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (statsRef.current && stats.dom) {
        statsRef.current.removeChild(stats.dom);
      }
      statsInstance.current = null;
    };
  }, []);

  return <div ref={statsRef} className="stats-container" />;
};
```

**Step 3: Integrate into XRVisualizationRoom**

```typescript
// In XRVisualizationRoom.tsx
import { StatsMonitor } from '@/components/StatsMonitor';

export const XRVisualizationRoom = ({ className }: XRVisualizationRoomProps) => {
  // ... existing code ...

  return (
    <div className={`relative w-full h-screen overflow-hidden cyber-grid ${className}`}>
      <StatsMonitor />

      <HolographicUI
        isVRMode={isVRMode}
        onVRToggle={setIsVRMode}
        dataIntensity={dataIntensity}
        onIntensityChange={setDataIntensity}
        currentScene={currentScene}
        onSceneChange={setCurrentScene}
      />

      {/* ... rest of UI ... */}

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
        {/* ... existing 3D scene ... */}
      </Canvas>
    </div>
  );
};
```

**Step 4: Commit**

```bash
git add src/components/StatsMonitor.tsx src/components/XRVisualizationRoom.tsx package.json package-lock.json
git commit -m "feat: add real FPS counter with Stats.js

- Install stats.js for performance monitoring
- Create StatsMonitor component
- Display real FPS, MS, and MB metrics
- Help users verify performance improvements
```

---

## Summary

This plan implements:

**Bug Fixes (A):**
1. ✅ Remove duplicate scenes array
2. ✅ Fix type safety (remove `as any`)
3. ✅ Fix redundant state synchronization
4. ✅ Verify asset path resolution
5. ✅ Add error boundary

**Performance Optimizations (B):**
6. ✅ Add React.memo to expensive components
7. ✅ Optimize particle animation (GPU shader)
8. ✅ Fix fake metrics generation
9. ✅ Add WebGL detection
10. ✅ Extract constants
11. ✅ Batch line rendering
12. ✅ Add real FPS counter

**Expected Results:**
- All bugs fixed
- 60 FPS at 8X intensity (up from ~15-25 FPS)
- 60-80% reduction in component re-renders
- Better error handling and user feedback
- Real performance metrics

**Estimated Time:** 2-3 hours for all tasks

**Next Phase:** Add showcase features (real data integration, interactive exploration)
