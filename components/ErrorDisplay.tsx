import type { ErrorDisplayProps } from '@/lib/types';

export default function ErrorDisplay({ message, statusCode }: ErrorDisplayProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8 dark:bg-black">
      <div className="w-full max-w-md text-center">
        {/* Error icon */}
        <div className="mb-6 flex justify-center">
          <svg
            className="h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Status code */}
        {statusCode && (
          <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-gray-200">
            {statusCode}
          </h1>
        )}

        {/* Error message */}
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {statusCode === 404 ? 'User Not Found' : 'Error'}
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">{message}</p>

        {/* GitHub link */}
        <a
          href="https://github.com"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          Go to GitHub
        </a>
      </div>
    </div>
  );
}
