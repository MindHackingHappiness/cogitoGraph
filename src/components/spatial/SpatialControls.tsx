import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  MousePointer,
  Layers,
  Filter,
  Shuffle
} from 'lucide-react';

interface SpatialControlsProps {
  dataIntensity: number;
  onIntensityChange: (value: number) => void;
}

export const SpatialControls = ({ dataIntensity, onIntensityChange }: SpatialControlsProps) => {
  return (
    <Card className="absolute bottom-20 left-4 spatial-panel neon-border z-40">
      <div className="p-4">
        <h3 className="text-cyber-primary font-mono font-bold mb-3 flex items-center gap-2">
          <MousePointer className="w-4 h-4" />
          SPATIAL CONTROLS
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Navigation Controls */}
          <Button variant="outline" size="sm" className="neon-border justify-start">
            <Move className="w-3 h-3 mr-2" />
            PAN
          </Button>
          
          <Button variant="outline" size="sm" className="neon-border justify-start">
            <RotateCcw className="w-3 h-3 mr-2" />
            ROTATE
          </Button>
          
          <Button variant="outline" size="sm" className="neon-border justify-start">
            <ZoomIn className="w-3 h-3 mr-2" />
            ZOOM+
          </Button>
          
          <Button variant="outline" size="sm" className="neon-border justify-start">
            <ZoomOut className="w-3 h-3 mr-2" />
            ZOOM-
          </Button>
          
          {/* View Controls */}
          <Button variant="outline" size="sm" className="neon-border justify-start">
            <Layers className="w-3 h-3 mr-2" />
            LAYERS
          </Button>
          
          <Button variant="outline" size="sm" className="neon-border justify-start">
            <Filter className="w-3 h-3 mr-2" />
            FILTER
          </Button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-cyber-accent font-mono">QUICK ACTIONS</span>
            <Badge variant="outline" className="text-[10px] border-cyber-accent">
              ULTRA
            </Badge>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full neon-border justify-start mb-2"
            onClick={() => onIntensityChange(8)}
          >
            <Shuffle className="w-3 h-3 mr-2" />
            MAXIMUM INTENSITY
          </Button>
          
          <div className="text-[10px] text-muted-foreground font-mono">
            CURRENT: {dataIntensity}X MODE
          </div>
        </div>
      </div>
    </Card>
  );
};