import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Activity,
  Zap,
  Brain,
  Atom,
  Eye,
  Settings,
  Maximize,
  Volume2,
  Github
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

type SceneType = 'cognitive' | 'neural' | 'quantum' | 'github';

interface HolographicUIProps {
  isVRMode: boolean;
  onVRToggle: (enabled: boolean) => void;
  dataIntensity: number;
  onIntensityChange: (value: number) => void;
  currentScene: SceneType;
  onSceneChange: (scene: SceneType) => void;
}

const HolographicUI = ({
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

  return (
    <>
      {/* Top Control Bar */}
      <Card className="absolute top-4 left-4 right-4 spatial-panel neon-border z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="hologram-text text-xl font-bold">
              XR COGNITIVE VISUALIZATION ROOM
            </h1>
            <Badge variant="outline" className="text-cyber-accent border-cyber-accent">
              ULTRA HD MODE
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isVRMode ? "default" : "outline"}
              size="sm"
              onClick={() => onVRToggle(!isVRMode)}
              className="neon-border"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isVRMode ? 'VR ACTIVE' : 'ENTER VR'}
            </Button>
            
            <Button variant="outline" size="sm" className="neon-border">
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm" className="neon-border">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Scene Selection */}
      <Card className="absolute top-20 left-4 spatial-panel neon-border z-40">
        <div className="p-4">
          <h3 className="text-cyber-primary font-mono font-bold mb-3">SCENE MODE</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'cognitive' as SceneType, icon: Brain, label: 'COGNITIVE SPACE' },
              { id: 'neural' as SceneType, icon: Activity, label: 'NEURAL NETWORK' },
              { id: 'quantum' as SceneType, icon: Atom, label: 'QUANTUM FIELD' },
              { id: 'github' as SceneType, icon: Github, label: 'GITHUB DATA' }
            ].map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant={currentScene === id ? "default" : "outline"}
                size="sm"
                onClick={() => onSceneChange(id)}
                className="justify-start neon-border"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Intensity Control */}
      <Card className="absolute bottom-4 left-4 spatial-panel neon-border z-40">
        <div className="p-4 w-64">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-cyber-accent" />
            <h3 className="text-cyber-primary font-mono font-bold">DATA INTENSITY</h3>
          </div>
          
          <div className="space-y-3">
            <Slider
              value={[dataIntensity]}
              onValueChange={(value) => onIntensityChange(value[0])}
              max={8}
              min={1}
              step={1}
              className="data-stream"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1X</span>
              <span className="text-cyber-accent font-bold">{dataIntensity}X</span>
              <span>8X</span>
            </div>
            
            <div className="text-xs text-cyber-primary font-mono">
              NODES: {dataIntensity * 20} | PARTICLES: {dataIntensity * 2000} | IMAGES: 3
            </div>
            
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              Use ↑↓ keys for quick intensity control
            </div>
          </div>
        </div>
      </Card>

      {/* Status Indicators */}
      <div className="absolute top-20 right-4 space-y-2 z-40">
        <Card className="spatial-panel neon-border p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyber-primary rounded-full pulse-glow" />
            <span className="text-xs text-cyber-primary font-mono">SYSTEM ACTIVE</span>
          </div>
        </Card>
        
        <Card className="spatial-panel neon-border p-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3 h-3 text-cyber-accent" />
            <span className="text-xs text-cyber-accent font-mono">SPATIAL AUDIO</span>
          </div>
        </Card>
        
        <Card className="spatial-panel neon-border p-3">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-cyber-secondary" />
            <span className="text-xs text-cyber-secondary font-mono">60 FPS</span>
          </div>
        </Card>
      </div>

      {/* Performance Overlay */}
      <div className="absolute bottom-4 right-4 z-40">
        <Card className="spatial-panel neon-border p-3">
          <div className="text-xs font-mono space-y-1">
            <div className="text-cyber-primary">GPU: {perfMetrics.gpu.toFixed(1)}%</div>
            <div className="text-cyber-accent">RAM: {perfMetrics.ram.toFixed(1)}%</div>
            <div className="text-cyber-secondary">NET: {perfMetrics.net.toFixed(0)}ms</div>
          </div>
        </Card>
      </div>

      {/* Loading Indicators */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none z-30"
          style={{
            top: `${20 + i * 30}%`,
            right: '10px',
          }}
        >
          <div className="w-1 h-8 bg-gradient-to-t from-transparent via-cyber-primary to-transparent data-stream" />
        </div>
      ))}
    </>
  );
};

export const HolographicUIMemo = React.memo(HolographicUI, (prevProps, nextProps) => {
  return (
    prevProps.isVRMode === nextProps.isVRMode &&
    prevProps.dataIntensity === nextProps.dataIntensity &&
    prevProps.currentScene === nextProps.currentScene
  );
  // Note: intentionally excluding callback functions from comparison
});

HolographicUIMemo.displayName = 'HolographicUI';

// Export with memo for backward compatibility
export { HolographicUIMemo as HolographicUI };