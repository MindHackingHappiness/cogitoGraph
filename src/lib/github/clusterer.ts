import { GitHubRepo } from './types';

const TOPIC_PATTERNS: Record<string, RegExp[]> = {
  'frontend': [
    /react|vue|angular|svelte|frontend|ui|component/i,
    /typescript|javascript/i,
  ],
  'backend': [
    /api|server|backend|rest|graphql/i,
  ],
  'ml-ai': [
    /ml|ai|machine.?learning|neural|tensor|pytorch/i,
    /python|jupyter/i,
  ],
  'devops': [
    /docker|k8s|kubernetes|devops|cicd|deploy/i,
  ],
  'testing': [
    /test|spec|mock|jest|cypress/i,
  ],
};

export const clusterReposByTopic = (repos: GitHubRepo[]): Map<string, GitHubRepo[]> => {
  const clusters = new Map<string, GitHubRepo[]>();

  repos.forEach((repo) => {
    // Primary: Use language as cluster key
    let clusterKey = repo.language || 'Other';

    // Secondary: Check if repo has topics we recognize
    if (repo.topics && repo.topics.length > 0) {
      for (const topic of repo.topics) {
        for (const [category, patterns] of Object.entries(TOPIC_PATTERNS)) {
          if (patterns.some((pattern) => pattern.test(topic))) {
            clusterKey = category;
            break;
          }
        }
        if (clusterKey !== repo.language) break;
      }
    }

    // Fallback: Extract from repo name/description
    if (clusterKey === repo.language || clusterKey === 'Other') {
      const searchText = `${repo.name} ${repo.description}`.toLowerCase();

      for (const [category, patterns] of Object.entries(TOPIC_PATTERNS)) {
        if (patterns.some((pattern) => pattern.test(searchText))) {
          clusterKey = category;
          break;
        }
      }
    }

    // Add to cluster
    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    const cluster = clusters.get(clusterKey);
    if (cluster) {
      cluster.push(repo);
    }
  });

  return clusters;
};
