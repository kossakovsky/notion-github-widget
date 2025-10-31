import { NextRequest, NextResponse } from 'next/server';
import { fetchUserContributions } from '@/lib/github';
import { processUsername } from '@/lib/validation';

export const runtime = 'edge'; // Use Edge Runtime for faster responses
export const revalidate = 3600; // Cache for 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username: rawUsername } = await params;

    // Validate and sanitize username
    const username = processUsername(rawUsername);

    if (!username) {
      return NextResponse.json(
        {
          error: 'Invalid GitHub username format',
          message:
            'Username must be 1-39 characters and contain only alphanumeric characters and hyphens',
        },
        { status: 400 }
      );
    }

    // Fetch contributions from GitHub API
    const response = await fetchUserContributions(username);

    // Check for errors
    if (response.errors && response.errors.length > 0) {
      const error = response.errors[0];

      if (error.type === 'NOT_FOUND') {
        return NextResponse.json(
          {
            error: 'User not found',
            message: `GitHub user "${username}" does not exist`,
          },
          {
            status: 404,
            headers: {
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: 'GitHub API error',
          message: error.message || 'Failed to fetch contributions',
        },
        { status: 500 }
      );
    }

    // Check if data exists
    if (!response.data?.user?.contributionsCollection) {
      return NextResponse.json(
        {
          error: 'No data',
          message: 'No contribution data available',
        },
        { status: 404 }
      );
    }

    // Return contributions data with cache headers
    return NextResponse.json(response.data.user.contributionsCollection, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
