import ErrorDisplay from '@/components/ErrorDisplay';

export default function NotFound() {
  return (
    <ErrorDisplay
      message="The GitHub user you're looking for doesn't exist. Please check the username and try again."
      statusCode={404}
    />
  );
}
