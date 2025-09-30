import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Zap,
  TrendingUp,
  Database
} from 'lucide-react';
import { useEffect, useState } from 'react';

export const MetricsOverlay = () => {
  const [metrics, setMetrics] = useState({
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    tokensSaved: 0,
    totalTokens: 0,
    latency: 0,
    throughput: 0
  });

  const [realTimeStats, setRealTimeStats] = useState({
    gpu: 75,
    cpu: 60,
    memory: 45,
    network: 120,
    fps: 60
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 3),
        cacheHits: prev.cacheHits + Math.floor(Math.random() * 2),
        cacheMisses: prev.cacheMisses + Math.floor(Math.random() * 1),
        tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 100),
        totalTokens: prev.totalTokens + Math.floor(Math.random() * 200),
        latency: 50 + Math.random() * 100,
        throughput: 100 + Math.random() * 500
      }));
      
      setRealTimeStats(prev => ({
        gpu: Math.max(30, Math.min(95, prev.gpu + (Math.random() - 0.5) * 10)),
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.max(30, Math.min(80, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(200, prev.network + (Math.random() - 0.5) * 20)),
        fps: Math.random() > 0.9 ? Math.floor(Math.random() * 10 + 55) : 60
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Metrics Panel */}
      <Card className="absolute top-32 right-4 spatial-panel neon-border z-40 w-80">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-cyber-primary" />
            <h3 className="text-cyber-primary font-mono font-bold">PERFORMANCE METRICS</h3>
            <Badge variant="outline" className="text-[10px] border-cyber-accent ml-auto">
              REAL-TIME
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">API CALLS</div>
              <div className="text-lg font-mono text-cyber-primary">{metrics.apiCalls}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">CACHE HITS</div>
              <div className="text-lg font-mono text-cyber-accent">{metrics.cacheHits}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">CACHE MISSES</div>
              <div className="text-lg font-mono text-cyber-warning">{metrics.cacheMisses}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">TOKENS SAVED</div>
              <div className="text-lg font-mono text-cyber-success">{metrics.tokensSaved}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">TOTAL TOKENS</span>
                <span className="text-cyber-primary font-mono">{metrics.totalTokens}</span>
              </div>
              <Progress value={(metrics.totalTokens % 1000) / 10} className="h-1" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">CACHE EFFICIENCY</span>
                <span className="text-cyber-accent font-mono">
                  {metrics.cacheHits + metrics.cacheMisses > 0 
                    ? ((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <Progress 
                value={metrics.cacheHits + metrics.cacheMisses > 0 
                  ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100
                  : 0} 
                className="h-1" 
              />
            </div>
          </div>
        </div>
      </Card>

      {/* System Resources */}
      <Card className="absolute bottom-32 right-4 spatial-panel neon-border z-40 w-64">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-cyber-secondary" />
            <h3 className="text-cyber-secondary font-mono font-bold">SYSTEM STATUS</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>GPU</span>
                </div>
                <span className="font-mono text-cyber-primary">{realTimeStats.gpu.toFixed(1)}%</span>
              </div>
              <Progress value={realTimeStats.gpu} className="h-1" />
            </div>
            
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>CPU</span>
                </div>
                <span className="font-mono text-cyber-accent">{realTimeStats.cpu.toFixed(1)}%</span>
              </div>
              <Progress value={realTimeStats.cpu} className="h-1" />
            </div>
            
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <div className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  <span>MEMORY</span>
                </div>
                <span className="font-mono text-cyber-success">{realTimeStats.memory.toFixed(1)}%</span>
              </div>
              <Progress value={realTimeStats.memory} className="h-1" />
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  <span>LATENCY</span>
                </div>
                <span className="font-mono text-cyber-warning">{metrics.latency.toFixed(0)}ms</span>
              </div>
              
              <div className="flex justify-between text-xs mt-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>FPS</span>
                </div>
                <span className="font-mono text-cyber-primary">{realTimeStats.fps}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Mini Status Bars */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-2 z-30">
        {[
          { label: 'NEURAL', value: 85, color: 'cyber-primary' },
          { label: 'QUANTUM', value: 92, color: 'cyber-secondary' },
          { label: 'CACHE', value: 76, color: 'cyber-accent' }
        ].map(({ label, value, color }) => (
          <div key={label} className="spatial-panel neon-border p-2 w-20">
            <div className={`text-[10px] font-mono text-${color} mb-1`}>{label}</div>
            <Progress value={value} className="h-0.5" />
            <div className={`text-[8px] font-mono text-${color} mt-1`}>{value}%</div>
          </div>
        ))}
      </div>
    </>
  );
};