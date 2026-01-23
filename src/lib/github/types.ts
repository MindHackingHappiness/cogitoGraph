export interface GitHubRepo {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  topics: string[];
  updatedAt: string;
}

export interface GitHubUser {
  login: string;
  avatarUrl: string;
  bio: string | null;
}

export interface GitHubAPIResponse {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  topics: string[];
  updated_at: string;
}
