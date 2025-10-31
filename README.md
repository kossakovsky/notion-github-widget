# GitHub Contributions Widget for Notion

A Next.js application that displays GitHub contribution graphs, embeddable in Notion pages.

## Features

- 📊 Display GitHub contribution graphs for any user
- 🎨 Light and dark theme support
- ⚡ Fast loading with 1-hour caching
- 🔒 Username validation and XSS protection
- 📱 Responsive design
- 🌐 Works perfectly in Notion embeds

## Usage

### Basic URL Structure

```
https://notion-github-widget.vercel.app/[username]
```

Replace `[username]` with any GitHub username.

### Examples

```
https://notion-github-widget.vercel.app/torvalds
https://notion-github-widget.vercel.app/octocat?theme=light
```

### Theme Options

Add `?theme=light` or `?theme=dark` to the URL:

```
https://notion-github-widget.vercel.app/[username]?theme=light
```

Default theme is `dark`.

## Embedding in Notion

1. In Notion, type `/embed` and select "Embed" block
2. Paste the URL with your desired GitHub username
3. Adjust the embed block size as needed
4. The contribution graph will display automatically

## Development

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **API**: GitHub GraphQL API (public, no auth)
- **Deployment**: Vercel

## Project Structure

```
app/
  [username]/        # Dynamic route for user pages
    page.tsx         # Main contribution graph page
    not-found.tsx    # Custom 404 page
  api/
    contributions/   # API endpoint for GitHub data
  page.tsx           # Landing page
components/
  ContributionGraph.tsx    # Main widget component
  ContributionSkeleton.tsx # Loading state
  ErrorDisplay.tsx         # Error handling UI
lib/
  github.ts          # GitHub API client
  validation.ts      # Security utilities
  types.ts           # TypeScript definitions
```

## Features in Detail

### Caching
- Server-side caching: 1 hour revalidation
- HTTP caching headers for CDN/browser
- Reduces GitHub API calls

### Security
- Username validation (GitHub format)
- XSS protection on URL parameters
- Sanitization of all user inputs

### Error Handling
- 404 for non-existent users
- GitHub API error handling
- User-friendly error messages

### SEO & Social
- Dynamic meta tags per user
- Open Graph support
- Twitter Card support

## License

MIT

## Links

- [Live Demo](https://notion-github-widget.vercel.app)
- [GitHub Repository](https://github.com/kossakovsky/notion-github-widget)
