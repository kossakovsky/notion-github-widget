# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GitHub Contributions Widget for Notion** - A production-ready Next.js 16 application that displays GitHub contribution graphs embeddable in Notion pages. Built with React 19, TypeScript (strict mode), and Tailwind CSS 4, using the modern App Router architecture.

### Purpose

Allows anyone to embed a GitHub user's contribution graph into Notion by simply providing a URL. The widget fetches real-time data from GitHub's GraphQL API and displays it in the familiar 53×7 grid format with interactive tooltips.

### Key Features

- 📊 **Real-time GitHub Data** - GraphQL API integration for contribution history
- 🎨 **Dual Themes** - Light and dark themes via URL parameter (`?theme=light/dark`)
- ⚡ **Multi-Layer Caching** - Server-side (1hr) + HTTP headers (CDN/browser)
- 🔒 **Security** - Username validation, XSS protection, input sanitization
- 💾 **Edge Runtime** - API routes deployed globally for low latency
- 📱 **Responsive** - Works on desktop, mobile, and Notion embeds
- ⏱️ **Loading States** - Skeleton animation during data fetch
- 🚨 **Error Handling** - 404, 400, 500 with user-friendly messages
- 📈 **Analytics** - Vercel Analytics for page views and interactions
- 🌐 **SEO Ready** - Dynamic metadata per user (Open Graph, Twitter Cards)

## Development Commands

### Running the Development Server

```bash
npm run dev
```

- Starts at **http://localhost:3000** (or next available port)
- Enables Hot Module Replacement (HMR)
- Fast Refresh for React components
- TypeScript type checking in watch mode
- ESLint integration

### Building for Production

```bash
npm run build
```

- Creates optimized production bundle in `.next/` directory
- Runs TypeScript compilation
- Generates static pages
- Shows build output with route information
- **Note**: Using Edge Runtime disables static generation for API routes

### Starting Production Server

```bash
npm start
```

- Serves the production build (requires `npm run build` first)
- Runs on port 3000 by default
- Use for testing production behavior locally

### Linting

```bash
npm run lint
```

- Runs ESLint with Next.js configuration
- Checks TypeScript files and React components
- Validates Next.js best practices (e.g., Link usage, image optimization)
- Enforces code quality rules

## Architecture

### Tech Stack Summary

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.1 | React framework, App Router, Server Components |
| React | 19.2.0 | UI library with latest features |
| TypeScript | ^5 | Type safety (strict mode) |
| Tailwind CSS | ^4 | Utility-first styling with inline theme config |
| Vercel Analytics | ^1.5.0 | Privacy-friendly analytics |

### App Router Structure

**Directory Layout:**

```
app/
├── layout.tsx                     # Root layout (Server Component)
├── page.tsx                       # Landing page (Server Component)
├── globals.css                    # Global styles, Tailwind imports
├── [username]/                    # Dynamic route
│   ├── page.tsx                  # User contribution page (Server Component)
│   └── not-found.tsx             # Custom 404 page
└── api/
    └── contributions/
        └── [username]/
            └── route.ts          # API endpoint (Edge Runtime)
```

**Key Files:**

- **`app/layout.tsx`** - Root layout defining HTML structure
  - Loads Geist Sans and Geist Mono fonts
  - Includes Vercel Analytics component
  - Sets default metadata
  - Wraps all pages

- **`app/page.tsx`** - Landing page
  - Usage instructions
  - Example links
  - Feature showcase
  - How to embed in Notion

- **`app/[username]/page.tsx`** - Dynamic user page
  - Server Component (async)
  - Fetches GitHub data server-side
  - Generates dynamic metadata per user
  - Implements error boundaries
  - Uses React Suspense for streaming

- **`app/[username]/not-found.tsx`** - 404 page
  - Shown when GitHub user doesn't exist
  - Custom branded error page
  - Link to GitHub homepage

- **`app/api/contributions/[username]/route.ts`** - API endpoint
  - Edge Runtime for global distribution
  - Validates username
  - Fetches from GitHub GraphQL API
  - Returns JSON response
  - Implements caching headers

### Components Architecture

**Location:** `components/`

All components are in the `components/` directory at project root (not in `app/components/`).

#### ContributionGraph.tsx

**Type:** Client Component (`'use client'`)

**Purpose:** Main visualization component displaying the contribution calendar grid.

**Props:**
```typescript
interface ContributionGraphProps {
  username: string;           // GitHub username
  theme: 'light' | 'dark';   // Theme from URL param
  data: ContributionCalendar; // GitHub API response data
}
```

**Key Features:**
- **Grid Rendering**: Maps through `data.weeks` (53 weeks) → `week.contributionDays` (7 days)
- **Color Coding**: 5 intensity levels based on contribution count
  ```typescript
  Level 0: count === 0        // Gray (no contributions)
  Level 1: count <= 3         // Light green
  Level 2: count <= 6         // Medium green
  Level 3: count <= 9         // Darker green
  Level 4: count >= 10        // Darkest green
  ```
- **Interactive Tooltips**:
  - State: `hoveredDay` (date, count, x, y position)
  - Shows on hover with exact count and formatted date
  - Positioned absolutely using mouse coordinates
- **Theme Support**: Different color palettes for light/dark
- **Accessibility**: Title attributes on each square

**Implementation Details:**
- Uses `useState` for tooltip state
- `getIntensityLevel()` - Maps count to 0-4 level
- `getColorClass()` - Returns Tailwind class based on level and theme
- `formatDate()` - Formats date for tooltip display
- `handleMouseEnter()` - Captures mouse position for tooltip

#### ContributionSkeleton.tsx

**Type:** Server Component (default)

**Purpose:** Loading placeholder shown while fetching GitHub data.

**Features:**
- Generates 53×7 grid of pulsing squares
- Staggered animation delays for wave effect
  ```typescript
  animationDelay: `${(week * 7 + day) * 10}ms`
  ```
- Matches ContributionGraph layout exactly
- Shows skeleton for:
  - Title area
  - Contribution grid
  - Legend

**Usage:** Wrapped in React `<Suspense>` fallback in `[username]/page.tsx`

#### ErrorDisplay.tsx

**Type:** Server Component (default)

**Purpose:** Shows user-friendly error messages.

**Props:**
```typescript
interface ErrorDisplayProps {
  message: string;      // Error description
  statusCode?: number;  // HTTP status (404, 400, 500)
}
```

**Features:**
- Warning icon (SVG)
- Large status code display
- Contextual heading (e.g., "User Not Found" for 404)
- Error message
- Link to GitHub homepage
- Full-screen centered layout
- Dark mode support

### Utilities Architecture

**Location:** `lib/`

#### lib/types.ts

**Purpose:** TypeScript interfaces and types for the entire application.

**Key Interfaces:**

```typescript
// GitHub API Response Types
interface ContributionDay {
  contributionCount: number;  // Number of contributions
  date: string;               // ISO date string
  color: string;              // GitHub's color (not used, we calculate our own)
  weekday: number;            // 0-6 (Sunday-Saturday)
}

interface ContributionWeek {
  contributionDays: ContributionDay[]; // 7 days
}

interface ContributionCalendar {
  totalContributions: number;  // Sum of all contributions
  weeks: ContributionWeek[];   // ~53 weeks
}

interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

interface GitHubUser {
  contributionsCollection: ContributionsCollection;
}

interface GitHubAPIResponse {
  data?: {
    user: GitHubUser | null;  // null if user doesn't exist
  };
  errors?: Array<{
    message: string;
    type: string;              // 'NOT_FOUND', 'FETCH_ERROR', etc.
  }>;
}

// Component Props
interface ContributionGraphProps { /* ... */ }
interface ErrorDisplayProps { /* ... */ }

// Utility Types
type Theme = 'light' | 'dark';
```

#### lib/github.ts

**Purpose:** GitHub GraphQL API client with caching.

**Key Function:**

```typescript
async function fetchUserContributions(
  username: string
): Promise<GitHubAPIResponse>
```

**Implementation:**
- **GraphQL Query**: Fetches `user.contributionsCollection.contributionCalendar`
- **No Authentication**: Uses public API (60 req/hour limit)
- **Caching**: `next: { revalidate: 3600 }` (1 hour server-side cache)
- **Error Handling**:
  - Network errors
  - Non-200 responses
  - User not found (returns error object)
  - GitHub API errors
- **User-Agent**: Set to `'notion-github-widget'` for identification

**GraphQL Query:**
```graphql
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
```

#### lib/validation.ts

**Purpose:** Security utilities for username validation and sanitization.

**Functions:**

1. **`validateGitHubUsername(username: string): boolean`**
   - Validates against GitHub username rules
   - Regex: `/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/`
   - Checks:
     - Length: 1-39 characters
     - Characters: alphanumeric + hyphens only
     - No leading/trailing hyphens
     - No consecutive hyphens

2. **`sanitizeUsername(username: string): string`**
   - Removes non-alphanumeric characters (except hyphens)
   - XSS protection: strips dangerous chars
   - Returns cleaned string

3. **`processUsername(username: string): string | null`**
   - Combines sanitization + validation
   - Returns sanitized username or `null` if invalid
   - Used in all routes for username processing

4. **`validateTheme(theme: string | null | undefined): Theme`**
   - Ensures theme is 'light' or 'dark'
   - Defaults to 'dark'
   - Prevents invalid theme values

5. **`createSafeErrorMessage(error: unknown): string`**
   - Safely extracts error messages
   - Prevents sensitive info exposure in production
   - Returns generic message for non-Error types

### Data Flow

**Request Flow for `/:username` page:**

1. **User navigates** → `/torvalds?theme=dark`

2. **Next.js Router** → Matches `app/[username]/page.tsx`

3. **Server Component** (`UserContributionsPage`):
   - Extracts `params.username` and `searchParams.theme`
   - Calls `processUsername()` - validates/sanitizes username
   - If invalid → Returns `<ErrorDisplay statusCode={400} />`
   - Calls `validateTheme()` - ensures valid theme
   - Calls `fetchUserContributions(username)` - GitHub API
   - If error → Returns `<ErrorDisplay statusCode={404|500} />`
   - If success → Renders `<ContributionGraph />` with data

4. **Client Component** (`ContributionGraph`):
   - Receives props: `username`, `theme`, `data`
   - Renders 53×7 grid of squares
   - Calculates colors based on contribution counts
   - Handles hover interactions for tooltips

5. **Suspense Boundary**:
   - Shows `<ContributionSkeleton />` during data fetch
   - Streams content to client as it becomes available

**API Endpoint Flow for `/api/contributions/:username`:**

1. **Fetch request** → `/api/contributions/torvalds`

2. **Edge Runtime** (globally distributed):
   - Runs `GET` handler in `route.ts`
   - Validates username via `processUsername()`
   - If invalid → Returns JSON error (400)
   - Calls `fetchUserContributions()`
   - If user not found → Returns JSON error (404)
   - If GitHub error → Returns JSON error (500)
   - If success → Returns JSON with contribution data

3. **Cache Headers** added:
   ```
   Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
   ```

4. **Response** cached by:
   - Browser (1 hour)
   - CDN (1 hour)
   - Stale content served while revalidating (2 hours)

### Path Aliases

**Configuration** (`tsconfig.json`):

```json
"paths": {
  "@/*": ["./*"]
}
```

**Usage:**
- `@/lib/types` → `/lib/types.ts`
- `@/components/ContributionGraph` → `/components/ContributionGraph.tsx`
- `@/app/globals.css` → `/app/globals.css`

**Benefits:**
- Clean imports regardless of file depth
- Easy refactoring
- No relative path hell (`../../..`)

### Styling

**Tailwind CSS 4 Configuration:**

- **Config File**: `postcss.config.mjs`
  ```javascript
  plugins: {
    "@tailwindcss/postcss": {},
  }
  ```

- **Global Styles**: `app/globals.css`
  - Imports Tailwind: `@import "tailwindcss";`
  - Defines CSS variables: `--background`, `--foreground`
  - Inline theme config: `@theme inline { ... }`
  - Dark mode via `@media (prefers-color-scheme: dark)`

**Tailwind Classes Used:**
- Layout: `flex`, `grid`, `min-h-screen`, `max-w-*`
- Spacing: `p-*`, `m-*`, `gap-*`
- Colors: `bg-*`, `text-*`, `border-*`
- Effects: `rounded-*`, `shadow-*`, `hover:*`, `dark:*`
- Animations: `animate-pulse`, `transition-*`

**Custom Styles:**
- Contribution squares: `h-3 w-3 rounded-sm`
- Hover ring: `hover:ring-2 hover:ring-gray-400`
- Tooltip positioning: Inline styles with `left` and `top` from state

### TypeScript Configuration

**Key Settings** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2017",              // Modern JS features
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,                  // All strict checks enabled
    "noEmit": true,                  // No JS output (Next.js handles)
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",   // Next.js 16 requirement
    "jsx": "react-jsx",              // Automatic JSX runtime
    "paths": { "@/*": ["./*"] }      // Path aliases
  }
}
```

**Important:**
- **Strict Mode**: All code must be type-safe
- **JSX**: `react-jsx` (not `preserve`) - no need to import React
- **Module Resolution**: `bundler` - required for Next.js 16
- **No Emit**: TypeScript only for type checking, not compilation

## URL Structure & Routing

### Main Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page with instructions |
| `/[username]` | Dynamic | User contribution graph page |
| `/[username]?theme=light` | Dynamic | Light theme variant |
| `/[username]?theme=dark` | Dynamic | Dark theme variant |
| `/api/contributions/[username]` | API (Edge) | JSON endpoint for contribution data |

### Dynamic Route Parameters

**Username Parameter** (`[username]`):
- Captured from URL path
- Accessed via `params.username` (async in Next.js 16)
- Must be valid GitHub username
- Validated and sanitized before use

**Theme Query Parameter** (`?theme=`):
- Optional URL query parameter
- Accessed via `searchParams.theme` (async in Next.js 16)
- Values: `'light'` or `'dark'`
- Defaults to `'dark'` if missing or invalid

**Example URLs:**
```
/torvalds              → Dark theme (default)
/torvalds?theme=dark   → Dark theme (explicit)
/torvalds?theme=light  → Light theme
/invalid-user          → 404 error page
```

## Security Features

### Username Validation

**Purpose:** Prevent injection attacks and ensure valid GitHub usernames.

**Implementation:**
- **Regex Pattern**: `/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/`
- **Rules Enforced**:
  - 1-39 characters only
  - Alphanumeric + hyphens
  - Cannot start with hyphen
  - Cannot end with hyphen
  - No consecutive hyphens (e.g., `user--name` invalid)

**Why This Matters:**
- Prevents SQL injection (though not applicable here)
- Prevents command injection
- Prevents XSS via username parameter
- Matches GitHub's actual username rules

### XSS Protection

**Layers of Defense:**

1. **Input Sanitization** (`sanitizeUsername()`):
   - Removes all non-alphanumeric chars except hyphens
   - Applied before validation

2. **React JSX Escaping**:
   - All dynamic content is automatically escaped
   - No `dangerouslySetInnerHTML` used anywhere

3. **TypeScript Type Safety**:
   - Ensures only valid types are passed to components
   - Compile-time checks prevent many vulnerabilities

4. **Next.js Built-in Protection**:
   - Automatic XSS protection in Server Components
   - Safe rendering of user input

### API Rate Limiting

**GitHub API Limits:**
- **Unauthenticated**: 60 requests/hour per IP
- **Authenticated**: 5000 requests/hour (not used)

**How Caching Helps:**
- First request: Fetches from GitHub (1 API call)
- Next 59 minutes: Served from cache (0 API calls)
- Effective rate: ~1 API call per username per hour
- Multiple users can view same username (shared cache)

**If Rate Limit Exceeded:**
- GitHub returns error
- Widget shows error message
- User must wait ~1 hour or use different IP

## Caching Strategy

### Multi-Layer Caching

**1. Server-Side Cache (Next.js Data Cache)**
```typescript
export const revalidate = 3600; // 1 hour
```
- Applied to:
  - `app/[username]/page.tsx` (page component)
  - `app/api/contributions/[username]/route.ts` (API route)
  - `lib/github.ts` `fetch()` call
- **Behavior**:
  - First request: Fetch from GitHub → Cache response
  - Subsequent requests: Serve from cache (instant)
  - After 1 hour: Revalidate (fetch fresh data)
- **Scope**: Server-side, shared across all users

**2. HTTP Cache Headers**
```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
```
- Applied to: API responses
- **Directives**:
  - `public`: Can be cached by any cache (CDN, browser)
  - `s-maxage=3600`: CDN caches for 1 hour
  - `stale-while-revalidate=7200`: Serve stale content while revalidating for 2 hours
- **Benefits**:
  - CDN caching reduces server load
  - Browser caching reduces network requests
  - Stale-while-revalidate improves perceived performance

**3. Fetch API Cache (GitHub API Client)**
```typescript
fetch(GITHUB_API_URL, {
  next: { revalidate: 3600 },
  // ...
})
```
- Next.js-specific caching for `fetch()` calls
- Deduplicates requests within revalidation period
- Integrated with Next.js Data Cache

### Cache Invalidation

**When Cache is Invalidated:**
- After 1 hour (automatic)
- On deployment (Next.js clears cache)
- Manual: Not implemented (no admin UI)

**Stale Data Handling:**
- Stale-while-revalidate allows serving old data
- Background fetch updates cache
- User sees instant response, next user gets fresh data

## GitHub GraphQL API Integration

### API Endpoint

```
https://api.github.com/graphql
```

### Authentication

**Not Used!** The widget uses GitHub's public API without authentication.

**Why No Auth:**
- Simpler deployment (no tokens to manage)
- Works immediately without setup
- Sufficient rate limit with caching (60/hour → effectively unlimited with cache)

**Trade-offs:**
- Lower rate limit (60 vs 5000 per hour)
- Mitigated by aggressive caching

### GraphQL Query

```graphql
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
```

**Query Explanation:**
- `user(login: $username)`: Find user by login name
  - Returns `null` if user doesn't exist (404)
- `contributionsCollection`: Last year's contribution data
- `contributionCalendar`: Calendar view of contributions
  - `totalContributions`: Sum of all contributions
  - `weeks`: Array of ~53 weeks (one year)
    - `contributionDays`: Array of 7 days per week
      - `contributionCount`: Number of contributions that day
      - `date`: ISO date string (e.g., "2024-01-15")
      - `color`: GitHub's assigned color (unused, we calculate our own)
      - `weekday`: 0-6 (0=Sunday, 6=Saturday)

### Response Structure

**Success Response:**
```typescript
{
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 1234,
          weeks: [
            {
              contributionDays: [
                { contributionCount: 5, date: "2024-01-01", color: "#...", weekday: 1 },
                // ... 6 more days
              ]
            },
            // ... ~52 more weeks
          ]
        }
      }
    }
  }
}
```

**Error Response (User Not Found):**
```typescript
{
  data: {
    user: null  // User doesn't exist
  }
}
```

**Error Response (API Error):**
```typescript
{
  errors: [
    {
      message: "Error message",
      type: "SOME_ERROR_TYPE"
    }
  ]
}
```

## Analytics

### Vercel Analytics Integration

**Installation:**
```bash
npm install @vercel/analytics
```

**Setup** (`app/layout.tsx`):
```typescript
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />  {/* Add at end of body */}
      </body>
    </html>
  );
}
```

**How It Works:**
- Automatically tracks page views when deployed to Vercel
- No configuration needed
- Privacy-friendly (no cookies)
- GDPR compliant

**What's Tracked:**
- Page views (unique and total)
- User interactions (clicks, navigation)
- Web Vitals (LCP, FID, CLS, FCP, TTFB)
- Geographic data (country-level only)

**Accessing Data:**
1. Deploy to Vercel
2. Go to project dashboard
3. Click "Analytics" tab
4. View real-time and historical data

### Development Mode

In development (`npm run dev`):
- Analytics component is inactive
- No data sent to Vercel
- Console logs may appear for debugging

In production (Vercel deployment):
- Analytics automatically enabled
- Real-time tracking starts immediately

## Error Handling & Edge Cases

### Error Types

**404 Not Found:**
- Trigger: GitHub user doesn't exist
- Response: Custom 404 page (`not-found.tsx`)
- Shown when: `notFound()` is called in page component

**400 Bad Request:**
- Trigger: Invalid username format
- Response: `<ErrorDisplay statusCode={400} />`
- Shown when: `processUsername()` returns `null`

**500 Server Error:**
- Trigger: GitHub API error or network failure
- Response: `<ErrorDisplay statusCode={500} />`
- Shown when: GitHub API returns errors

**Rate Limit Error:**
- Trigger: Exceeding GitHub API rate limit
- Response: Error message explaining rate limit
- Mitigation: Caching should prevent this

### Error Handling Patterns

**In Page Component** (`[username]/page.tsx`):
```typescript
const username = processUsername(rawUsername);
if (!username) {
  return <ErrorDisplay message="..." statusCode={400} />;
}

const response = await fetchUserContributions(username);
if (response.errors) {
  if (error.type === 'NOT_FOUND') {
    notFound(); // Shows app/[username]/not-found.tsx
  }
  return <ErrorDisplay message="..." statusCode={500} />;
}
```

**In API Route** (`api/contributions/[username]/route.ts`):
```typescript
const username = processUsername(rawUsername);
if (!username) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}

const response = await fetchUserContributions(username);
if (response.errors) {
  return NextResponse.json({ error: "..." }, { status: 404 });
}

return NextResponse.json(data, { status: 200 });
```

## Development Tips & Debugging

### Debugging GitHub API Calls

1. **Check Network Tab:**
   - Open DevTools → Network
   - Filter by "contributions"
   - Inspect GraphQL POST request
   - Check response status and body

2. **Server Logs:**
   - API errors logged to console in `lib/github.ts`
   - Check terminal running `npm run dev`

3. **Test with GraphQL Playground:**
   - Visit: https://docs.github.com/en/graphql/overview/explorer
   - Run query with different usernames
   - Compare responses

### Testing Edge Cases

**Valid Usernames:**
```
torvalds, gaearon, octocat, tj, defunkt
```

**Invalid Usernames:**
```
-invalid (starts with hyphen)
invalid- (ends with hyphen)
user--name (consecutive hyphens)
toolongtoolongtoolongtoolongtoolongname (>39 chars)
user@name (invalid character)
```

**Special Cases:**
```
user-name (valid: single hyphen between alphanum)
123user (valid: starts with number)
USER (valid: uppercase)
```

### Common Development Issues

**Issue:** Port 3000 already in use
**Solution:**
- Next.js will automatically use next available port (3001, 3002, etc.)
- Or kill process using port 3000: `lsof -ti:3000 | xargs kill`

**Issue:** TypeScript errors in editor
**Solution:**
- Restart TypeScript server in VS Code
- Run `npm run build` to see actual errors
- Check `.next/types/` directory exists

**Issue:** Styles not updating
**Solution:**
- Tailwind CSS 4 uses PostCSS
- Restart dev server if styles don't update
- Check `postcss.config.mjs` is correct

**Issue:** "Invalid hook call" error
**Solution:**
- Ensure `'use client'` directive at top of component
- Check React versions match (`react` and `react-dom`)
- Clear `.next/` directory: `rm -rf .next`

### Performance Optimization Tips

1. **Reduce Bundle Size:**
   - Already minimal dependencies
   - No heavy libraries (Lodash, Moment.js, etc.)
   - Tree-shaking enabled by default

2. **Optimize Images:**
   - Use Next.js `<Image>` component (not used currently as no images)
   - SVGs for icons (already done)

3. **Server Components:**
   - Most components are Server Components by default
   - Only `ContributionGraph` needs `'use client'` for interactivity

4. **Edge Runtime:**
   - API route uses Edge Runtime for global distribution
   - Faster cold starts
   - Lower latency worldwide

## Deployment

### Vercel Deployment (Recommended)

**Prerequisites:**
- GitHub repository
- Vercel account (free tier works)

**Steps:**
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import GitHub repository
4. Vercel auto-detects Next.js
5. Click "Deploy"

**Environment Variables:**
- None required!
- Analytics automatically enabled on Vercel

**Custom Domain:**
- Add domain in Vercel dashboard
- Update DNS records
- Automatic HTTPS with SSL

### Self-Hosting

**Build:**
```bash
npm run build
```

**Run:**
```bash
npm start
```

**Requirements:**
- Node.js 20+
- Port 3000 available (or set PORT env var)

**Not Recommended:**
- Edge Runtime requires Vercel
- Analytics won't work without Vercel
- Caching less effective without CDN

## Key Files Reference

| File | Purpose | Type |
|------|---------|------|
| `app/layout.tsx` | Root HTML, fonts, Analytics | Server Component |
| `app/page.tsx` | Landing page | Server Component |
| `app/[username]/page.tsx` | User contribution page | Server Component (async) |
| `app/[username]/not-found.tsx` | Custom 404 | Server Component |
| `app/api/contributions/[username]/route.ts` | API endpoint | Edge Runtime |
| `app/globals.css` | Global styles, Tailwind | CSS |
| `components/ContributionGraph.tsx` | Main widget | Client Component |
| `components/ContributionSkeleton.tsx` | Loading state | Server Component |
| `components/ErrorDisplay.tsx` | Error UI | Server Component |
| `lib/github.ts` | GitHub API client | Utility |
| `lib/validation.ts` | Security utils | Utility |
| `lib/types.ts` | TypeScript interfaces | Types |
| `package.json` | Dependencies | Config |
| `tsconfig.json` | TypeScript config | Config |
| `next.config.ts` | Next.js config | Config |
| `postcss.config.mjs` | Tailwind config | Config |
| `eslint.config.mjs` | ESLint config | Config |

## Contribution Guidelines

When making changes:

1. **Run Linter:** `npm run lint` before committing
2. **Build Check:** `npm run build` to ensure no errors
3. **Test Usernames:** Try valid/invalid usernames
4. **Check Types:** Ensure all TypeScript types are correct
5. **Update Docs:** Update this file and README.md if needed
6. **Test Themes:** Verify both light and dark themes work
7. **Mobile Test:** Check responsive design

## Additional Resources

- **Next.js 16 Docs:** https://nextjs.org/docs
- **React 19 Docs:** https://react.dev
- **Tailwind CSS 4:** https://tailwindcss.com/docs
- **GitHub GraphQL API:** https://docs.github.com/en/graphql
- **TypeScript Handbook:** https://www.typescriptlang.org/docs
- **Vercel Docs:** https://vercel.com/docs

---

Last Updated: 2025-10-31
