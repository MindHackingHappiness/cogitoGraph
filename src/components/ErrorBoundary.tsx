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
