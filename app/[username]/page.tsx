import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ContributionGraph from '@/components/ContributionGraph';
import ContributionSkeleton from '@/components/ContributionSkeleton';
import ErrorDisplay from '@/components/ErrorDisplay';
import { fetchUserContributions } from '@/lib/github';
import { processUsername, validateTheme } from '@/lib/validation';
import type { Theme } from '@/lib/types';

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ theme?: string }>;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username: rawUsername } = await params;
  const username = processUsername(rawUsername);

  if (!username) {
    return {
      title: 'Invalid Username',
      description: 'The provided GitHub username is invalid',
    };
  }

  const title = `${username}'s GitHub Contributions`;
  const description = `View ${username}'s GitHub contribution graph and activity over the past year`;
  const url = `https://notion-github-widget.vercel.app/${username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'GitHub Contributions Widget',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

// Main page component
export default async function UserContributionsPage({
  params,
  searchParams,
}: PageProps) {
  const { username: rawUsername } = await params;
  const { theme: rawTheme } = await searchParams;

  // Validate and sanitize username
  const username = processUsername(rawUsername);

  if (!username) {
    return (
      <ErrorDisplay
        message="Invalid GitHub username format. Username must be 1-39 characters and contain only alphanumeric characters and hyphens."
        statusCode={400}
      />
    );
  }

  // Validate theme
  const theme: Theme = validateTheme(rawTheme);

  // Fetch contributions data
  const response = await fetchUserContributions(username);

  // Handle errors
  if (response.errors && response.errors.length > 0) {
    const error = response.errors[0];

    if (error.type === 'NOT_FOUND') {
      notFound();
    }

    return (
      <ErrorDisplay
        message={error.message || 'Failed to fetch contributions'}
        statusCode={500}
      />
    );
  }

  // Check if data exists
  if (!response.data?.user?.contributionsCollection?.contributionCalendar) {
    return (
      <ErrorDisplay
        message="No contribution data available for this user"
        statusCode={404}
      />
    );
  }

  const contributionData = response.data.user.contributionsCollection.contributionCalendar;

  return (
    <Suspense fallback={<ContributionSkeleton />}>
      <ContributionGraph
        username={username}
        theme={theme}
        data={contributionData}
      />
    </Suspense>
  );
}

// Configure page caching
export const revalidate = 3600; // Revalidate every hour
