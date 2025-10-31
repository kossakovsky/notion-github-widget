// GitHub API Types
export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
  weekday: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

export interface GitHubUser {
  contributionsCollection: ContributionsCollection;
}

export interface GitHubAPIResponse {
  data?: {
    user: GitHubUser | null;
  };
  errors?: Array<{
    message: string;
    type: string;
  }>;
}

// Component Props Types
export interface ContributionGraphProps {
  username: string;
  theme: 'light' | 'dark';
  data: ContributionCalendar;
}

export interface ErrorDisplayProps {
  message: string;
  statusCode?: number;
}

export type Theme = 'light' | 'dark';
