# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub Contributions Widget for Notion - A Next.js 16 application that displays GitHub contribution graphs embeddable in Notion. Built with React 19, TypeScript, and Tailwind CSS 4, using the App Router architecture.

### Key Features
- Display GitHub contribution graphs for any user
- Light and dark theme support via URL parameter
- GitHub GraphQL API integration (public, no auth token required)
- Username validation and XSS protection
- 1-hour caching (server-side + HTTP headers)
- Loading states with skeleton animations
- Error handling for 404 and API errors
- Dynamic metadata for SEO and social sharing
- Vercel Analytics for tracking page views and interactions

## Development Commands

### Running the Development Server
```bash
npm run dev
```
The dev server runs at http://localhost:3000 and supports hot module replacement.

### Building for Production
```bash
npm run build
```
Creates an optimized production build.

### Starting Production Server
```bash
npm start
```
Runs the production build locally (must run `npm run build` first).

### Linting
```bash
npm run lint
```
Runs ESLint with Next.js-specific rules for TypeScript and Web Vitals.

## Architecture

### App Router Structure
- Uses Next.js App Router (not Pages Router)
- Root layout: `app/layout.tsx` - defines the HTML structure, metadata, and font loading (Geist Sans and Geist Mono)
- Main page: `app/page.tsx` - landing page with usage instructions
- Dynamic route: `app/[username]/page.tsx` - displays contribution graph for specified GitHub user
- API route: `app/api/contributions/[username]/route.ts` - fetches data from GitHub GraphQL API
- Global styles: `app/globals.css` - Tailwind CSS imports and CSS variables for theming

### Components
- `components/ContributionGraph.tsx` - Main widget component displaying the contribution calendar grid (53 weeks × 7 days)
- `components/ContributionSkeleton.tsx` - Loading skeleton with pulse animation
- `components/ErrorDisplay.tsx` - Error state UI for 404 and API errors
- `components/` directory contains all reusable UI components

### Utilities
- `lib/github.ts` - GitHub GraphQL API client with caching
- `lib/validation.ts` - Username validation, XSS protection, and theme validation
- `lib/types.ts` - TypeScript interfaces for GitHub API responses and component props

### Path Aliases
- `@/*` resolves to the project root (configured in `tsconfig.json`)
- Use this for clean imports: `import { foo } from '@/app/components/foo'`

### Styling
- Tailwind CSS 4 is configured via PostCSS (`postcss.config.mjs`)
- Uses inline theme configuration in `globals.css` with CSS variables
- Dark mode support via `prefers-color-scheme` media query
- Custom color variables: `--background`, `--foreground`

### TypeScript Configuration
- Strict mode enabled
- JSX configured as `react-jsx` (not `preserve`)
- Module resolution: `bundler`
- Next.js plugin automatically generates types in `.next/types/`

### Static Assets
- Place static files in the `public/` directory
- Reference them from root: `/file.svg` (not `/public/file.svg`)

## URL Structure

### Main Routes
- `/` - Landing page with usage instructions
- `/[username]` - Display contributions for GitHub username
- `/[username]?theme=light` - Light theme variant
- `/[username]?theme=dark` - Dark theme variant (default)

### API Endpoint
- `/api/contributions/[username]` - Returns contribution data as JSON

## Security Features

### Username Validation
- Validates GitHub username format: 1-39 characters, alphanumeric + hyphens
- Cannot start/end with hyphen or contain consecutive hyphens
- Regex: `^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$`

### XSS Protection
- All username inputs are sanitized before use
- URL parameters are validated and cleaned
- React's built-in XSS protection via JSX escaping

## Caching Strategy

- **Server-side**: `revalidate: 3600` (1 hour) in page and API route
- **HTTP headers**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200`
- This reduces GitHub API calls and improves performance

## GitHub API

### Using GraphQL API
- Endpoint: `https://api.github.com/graphql`
- Query: `user.contributionsCollection.contributionCalendar`
- No authentication token (public API, lower rate limit)
- Returns contribution data for the last year

### Rate Limits
- Without token: 60 requests/hour per IP
- Caching helps stay within limits

## Analytics

### Vercel Analytics
- Installed via `@vercel/analytics` package
- Added to `app/layout.tsx` as `<Analytics />` component
- Privacy-friendly analytics without cookies
- Automatically tracks page views and interactions when deployed to Vercel
- No configuration needed for basic analytics

## Key Files

- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint flat config with Next.js presets
- `tsconfig.json` - TypeScript compiler options with strict mode
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS 4
- `app/layout.tsx` - Root layout with metadata, font configuration, and Vercel Analytics
- `app/page.tsx` - Landing page component
- `app/[username]/page.tsx` - Dynamic route for user contributions
- `app/[username]/not-found.tsx` - Custom 404 page for invalid users
- `app/api/contributions/[username]/route.ts` - API endpoint using Edge Runtime
- `app/globals.css` - Global styles and Tailwind imports
- `lib/` - Utility functions and type definitions
- `components/` - React components for the widget
