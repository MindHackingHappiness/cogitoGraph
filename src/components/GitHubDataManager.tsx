import { useState } from 'react';
import { GitHubRepo } from '@/lib/github/types';
import { useGitHubData } from '@/hooks/useGitHubData';
import { GitHubControlPanel } from './ui/GitHubControlPanel';
import { GitHubVisualizer } from './spatial/GitHubVisualizer';

interface GitHubDataManagerProps {
  onDataReady: (repos: GitHubRepo[]) => void;
}

export const GitHubDataManager = ({ onDataReady }: GitHubDataManagerProps) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealMode, setIsRealMode] = useState(false);

  const { fetchRepos, cache } = useGitHubData();

  const handleFetch = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRepos(username, isRealMode);
      setRepos(data);
      onDataReady(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="github-data-manager">
      <GitHubControlPanel
        onFetch={handleFetch}
        loading={loading}
        error={error}
        isRealMode={isRealMode}
        onModeToggle={() => setIsRealMode(!isRealMode)}
        cached={cache}
      />

      {repos.length > 0 && <GitHubVisualizer repos={repos} />}
    </div>
  );
};
