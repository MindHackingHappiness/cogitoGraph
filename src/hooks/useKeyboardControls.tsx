import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseKeyboardControlsProps {
  dataIntensity: number;
  onIntensityChange: (value: number) => void;
  currentScene: 'cognitive' | 'neural' | 'quantum';
  onSceneChange: (scene: 'cognitive' | 'neural' | 'quantum') => void;
}

export const useKeyboardControls = ({
  dataIntensity,
  onIntensityChange,
  currentScene,
  onSceneChange
}: UseKeyboardControlsProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent default on special keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowUp':
          if (dataIntensity < 8) {
            const newIntensity = Math.min(8, dataIntensity + 1);
            onIntensityChange(newIntensity);
            toast({
              title: "INTENSITY INCREASED",
              description: `Data intensity: ${newIntensity}X`,
              className: "bg-cyber-primary/10 border-cyber-primary text-cyber-primary"
            });
          }
          break;
        
        case 'ArrowDown':
          if (dataIntensity > 1) {
            const newIntensity = Math.max(1, dataIntensity - 1);
            onIntensityChange(newIntensity);
            toast({
              title: "INTENSITY DECREASED",
              description: `Data intensity: ${newIntensity}X`,
              className: "bg-cyber-accent/10 border-cyber-accent text-cyber-accent"
            });
          }
          break;
        
        case 'ArrowLeft':
          const scenes = ['cognitive', 'neural', 'quantum'] as const;
          const currentIndex = scenes.indexOf(currentScene);
          const prevScene = scenes[(currentIndex - 1 + scenes.length) % scenes.length];
          onSceneChange(prevScene);
          toast({
            title: "SCENE SWITCHED",
            description: `Now viewing: ${prevScene.toUpperCase()} SPACE`,
            className: "bg-cyber-secondary/10 border-cyber-secondary text-cyber-secondary"
          });
          break;
        
        case 'ArrowRight':
          const scenesRight = ['cognitive', 'neural', 'quantum'] as const;
          const currentIndexRight = scenesRight.indexOf(currentScene);
          const nextScene = scenesRight[(currentIndexRight + 1) % scenesRight.length];
          onSceneChange(nextScene);
          toast({
            title: "SCENE SWITCHED",
            description: `Now viewing: ${nextScene.toUpperCase()} SPACE`,
            className: "bg-cyber-secondary/10 border-cyber-secondary text-cyber-secondary"
          });
          break;
        
        case ' ':
          // Spacebar for max intensity
          onIntensityChange(8);
          toast({
            title: "MAXIMUM INTENSITY ACTIVATED",
            description: "Data intensity: 8X ULTRA MODE",
            className: "bg-gradient-to-r from-cyber-primary to-cyber-accent border-cyber-primary text-white"
          });
          break;
        
        case 'r':
        case 'R':
          // Reset to default
          onIntensityChange(3);
          onSceneChange('cognitive');
          toast({
            title: "SYSTEM RESET",
            description: "Returned to default cognitive space (3X)",
            className: "bg-muted border-muted-foreground text-foreground"
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dataIntensity, currentScene, onIntensityChange, onSceneChange, toast]);
};