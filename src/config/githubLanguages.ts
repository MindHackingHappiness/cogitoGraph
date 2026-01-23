export const LANGUAGE_COLORS: Record<string, string> = {
  'TypeScript': '#f1e05a',
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Rust': '#dea584',
  'Go': '#00ADD8',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'default': '#8b949e',
};

export const getLanguageColor = (language: string | null): string => {
  if (!language) return LANGUAGE_COLORS.default;
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
};
