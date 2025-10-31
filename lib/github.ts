import type { GitHubAPIResponse } from './types';

const GITHUB_API_URL = 'https://api.github.com/graphql';

// GraphQL query to fetch user contributions for the last year
const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

export async function fetchUserContributions(
  username: string
): Promise<GitHubAPIResponse> {
  try {
    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Using public API without authentication token
        'User-Agent': 'notion-github-widget',
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username },
      }),
      // Cache for 1 hour
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: GitHubAPIResponse = await response.json();

    // Check if user exists
    if (data.data?.user === null) {
      return {
        errors: [
          {
            message: `User "${username}" not found`,
            type: 'NOT_FOUND',
          },
        ],
      };
    }

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      return data;
    }

    return data;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return {
      errors: [
        {
          message: error instanceof Error ? error.message : 'Failed to fetch contributions',
          type: 'FETCH_ERROR',
        },
      ],
    };
  }
}
