import { GitHubRepo } from './types';

export const calculateNodeSize = (stars: number): number => {
  if (stars < 50) return 0.5;
  if (stars < 500) return 1.0;
  if (stars < 5000) return 1.5;
  return 2.0;
};

export const getLanguageColorClass = (language: string): string => {
  const colorMap: Record<string, string> = {
    'TypeScript': 'text-yellow-400',
    'JavaScript': 'text-yellow-400',
    'Python': 'text-blue-400',
    'Rust': 'text-orange-400',
    'Go': 'text-cyan-400',
  };

  return colorMap[language] || 'text-gray-400';
};
