import { GitHubRepo } from './types';

const LANGUAGES = ['TypeScript', 'Python', 'Rust', 'Go', 'JavaScript'] as const;
const TOPICS = ['frontend', 'backend', 'ml-ai', 'devops', 'testing'] as const;

export const generateMockGitHubData = (username: string): GitHubRepo[] => {
  return Array.from({ length: 100 }, (_, i) => {
    const topic = TOPICS[i % TOPICS.length];
    const language = LANGUAGES[i % LANGUAGES.length];
    const stars = Math.floor(Math.random() * 10000);
    const forks = Math.floor(Math.random() * 500);

    return {
      id: `mock-${i}`,
      name: `${username}/${topic}-${i}`,
      description: `A ${topic} project built with ${language}`,
      language,
      stars,
      forks,
      url: `https://github.com/${username}/${topic}-${i}`,
      topics: [topic],
      updatedAt: new Date().toISOString(),
    };
  });
};
