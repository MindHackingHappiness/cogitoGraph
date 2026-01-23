import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';

interface GitHubControlPanelProps {
  onFetch: (username: string) => void;
  loading: boolean;
  error: string | null;
  isRealMode: boolean;
  onModeToggle: () => void;
  cached: Map<string, unknown>;
}

export const GitHubControlPanel = ({
  onFetch,
  loading,
  error,
  isRealMode,
  onModeToggle,
  cached,
}: GitHubControlPanelProps) => {
  const [username, setUsername] = useState('');

  const handleFetch = () => {
    if (username.trim()) {
      onFetch(username.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <div className="github-control-panel bg-black/80 border border-cyber-primary rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="bg-cyber-primary/10 border-cyber-primary text-cyber-primary"
          />
        </div>

        <Button
          onClick={handleFetch}
          disabled={loading || !username.trim()}
          className="bg-cyber-primary hover:bg-cyber-primary/80"
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </Button>

        <Button
          onClick={onModeToggle}
          variant="outline"
          className={isRealMode ? 'border-cyber-accent text-cyber-accent' : ''}
        >
          {isRealMode ? '🌐 REAL' : '☁️ MOCK'}
        </Button>

        {cached.size > 0 && (
          <span className="text-xs text-gray-400">
            {cached.size} cached
          </span>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};
