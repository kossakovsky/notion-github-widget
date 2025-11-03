# GitHub Contributions Widget for Notion

A Next.js application that displays GitHub contribution graphs, embeddable directly into Notion pages. View any GitHub user's contribution history for the last year with a clean, interactive visualization.

## ✨ Features

- 📊 **GitHub Contribution Graphs** - Displays the iconic 53×7 grid showing daily contributions
- 🎨 **Dual Theme Support** - Light and dark themes matching GitHub's style
- ⚡ **Optimized Performance** - 1-hour server-side and HTTP caching
- 🔒 **Security First** - Username validation, XSS protection, and input sanitization
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🌐 **Notion Ready** - Seamless embedding in Notion pages
- 🎯 **Real-time Data** - Fetches live data from GitHub GraphQL API
- 💾 **Smart Caching** - Reduces API calls while keeping data fresh
- 📈 **Analytics Integration** - Built-in Vercel Analytics support
- ⏱️ **Loading States** - Smooth skeleton animations while data loads

## 🚀 Quick Start

### Basic Usage

Simply append any GitHub username to the URL:

```
https://notion-github-widget.vercel.app/[username]
```

### Examples

```
# View Linus Torvalds' contributions
https://notion-github-widget.vercel.app/torvalds

# View with light theme
https://notion-github-widget.vercel.app/octocat?theme=light

# View with dark theme (default)
https://notion-github-widget.vercel.app/gaearon?theme=dark
```

### Theme Options

Control the appearance with the `theme` URL parameter:

- **Dark theme** (default): `?theme=dark` or no parameter
- **Light theme**: `?theme=light`

## 📝 Embedding in Notion

1. **Create an Embed Block**
   - In your Notion page, type `/embed`
   - Select "Embed" from the menu

2. **Paste the URL**
   - Enter: `https://notion-github-widget.vercel.app/[username]`
   - Replace `[username]` with the GitHub username you want to display

3. **Adjust Size**
   - Drag the embed block corners to resize
   - Recommended minimum width: 800px for best visibility

4. **Choose Theme** (Optional)
   - Add `?theme=light` or `?theme=dark` to match your Notion page theme

### Notion Embed Example

```
https://notion-github-widget.vercel.app/torvalds?theme=light
```

## 🛠️ Development

### Prerequisites

- **Node.js**: 20.x or higher
- **Package Manager**: npm, yarn, pnpm, or bun
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/kossakovsky/notion-github-widget.git
cd notion-github-widget

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add your GitHub token
```

### Available Scripts

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server (requires build first)
npm start

# Lint code
npm run lint
```

### Development Server

The development server runs at `http://localhost:3000` with:
- Hot Module Replacement (HMR)
- Fast Refresh for React components
- TypeScript checking
- ESLint integration

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.1 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling |
| Vercel Analytics | ^1.5.0 | Privacy-friendly analytics |

### Key Technologies

- **Next.js 16 App Router** - Server Components, streaming, and optimized rendering
- **TypeScript Strict Mode** - Full type safety across the codebase
- **Tailwind CSS 4** - Utility-first CSS with inline theme configuration
- **GitHub GraphQL API** - Official API for contribution data
- **Edge Runtime** - API routes optimized for global edge deployment

## 📦 Project Structure

```
notion-github-widget/
├── app/
│   ├── [username]/              # Dynamic user routes
│   │   ├── page.tsx            # Contribution graph page
│   │   └── not-found.tsx       # Custom 404 page
│   ├── api/
│   │   └── contributions/
│   │       └── [username]/
│   │           └── route.ts    # GitHub API endpoint (Edge Runtime)
│   ├── layout.tsx              # Root layout with Analytics
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── ContributionGraph.tsx   # Main contribution widget (Client Component)
│   ├── ContributionSkeleton.tsx # Loading skeleton
│   └── ErrorDisplay.tsx        # Error state UI
├── lib/
│   ├── github.ts               # GitHub GraphQL client
│   ├── validation.ts           # Security & validation utils
│   └── types.ts                # TypeScript interfaces
├── public/                     # Static assets
├── CLAUDE.md                   # Claude Code documentation
├── README.md                   # This file
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── next.config.ts              # Next.js config
```

## 🎨 Features in Detail

### Contribution Graph Visualization

- **Grid Layout**: 53 weeks × 7 days matching GitHub's design
- **Color Intensity**: 5 levels based on contribution count
  - Level 0: No contributions (gray)
  - Level 1: 1-3 contributions (light green)
  - Level 2: 4-6 contributions (medium green)
  - Level 3: 7-9 contributions (darker green)
  - Level 4: 10+ contributions (darkest green)
- **Interactive Tooltips**: Hover to see exact contribution count and date
- **Responsive Legend**: Shows intensity scale (Less → More)

### Caching Strategy

**Multi-Layer Caching for Optimal Performance:**

1. **Server-Side Caching** (`revalidate: 3600`)
   - Next.js revalidates data every hour
   - Shared across all users viewing same username
   - Reduces GitHub API calls significantly

2. **HTTP Cache Headers**
   ```
   Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
   ```
   - Browser caching: 1 hour
   - CDN caching: 1 hour
   - Stale-while-revalidate: 2 hours (serves stale content while updating)

3. **Benefits**:
   - Faster page loads
   - Reduced GitHub API usage (60 req/hour limit)
   - Better user experience
   - Lower server costs

### Security Features

**Comprehensive Input Protection:**

1. **Username Validation**
   - Regex: `^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$`
   - Validates GitHub username rules:
     - 1-39 characters
     - Alphanumeric + hyphens
     - Cannot start/end with hyphen
     - No consecutive hyphens

2. **XSS Protection**
   - Sanitizes all URL parameters
   - Removes dangerous characters
   - React's JSX auto-escaping
   - No dangerouslySetInnerHTML usage

3. **Input Sanitization**
   - `sanitizeUsername()`: Strips non-alphanumeric chars (except hyphens)
   - `processUsername()`: Validates + sanitizes in one step
   - Type-safe with TypeScript

### Error Handling

**Robust Error Management:**

- **404 Not Found**: Invalid or non-existent GitHub users
- **400 Bad Request**: Invalid username format
- **500 Server Error**: GitHub API failures
- **Rate Limiting**: Graceful handling of GitHub API limits
- **User-Friendly Messages**: Clear, actionable error descriptions
- **Custom 404 Page**: Branded error page with GitHub link

### SEO & Social Sharing

**Dynamic Metadata Generation:**

- **Per-User Meta Tags**: Title and description based on username
- **Open Graph**: Full OG tags for Facebook, LinkedIn, etc.
  ```html
  <meta property="og:title" content="username's GitHub Contributions" />
  <meta property="og:description" content="View username's activity..." />
  <meta property="og:url" content="https://..." />
  ```
- **Twitter Cards**: Optimized for Twitter sharing
  ```html
  <meta name="twitter:card" content="summary_large_image" />
  ```
- **Canonical URLs**: SEO-friendly canonical links
- **Sitemap Ready**: Compatible with Next.js sitemap generation

### Analytics

**Privacy-Friendly Tracking:**

- **Vercel Analytics** integration
- No cookies required
- GDPR compliant
- Tracks:
  - Page views
  - User interactions
  - Performance metrics (Web Vitals)
- Dashboard access via Vercel deployment

## 🔧 Configuration

### Environment Variables

**Required:**

Create a `.env.local` file in the root directory:

```bash
GITHUB_TOKEN=your_github_personal_access_token
```

**How to get a GitHub token:**

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens/new)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Notion GitHub Widget")
4. Select the following scope:
   - ✅ `read:user` - Read user profile data
5. Click "Generate token"
6. Copy the token and add it to your `.env.local` file

**Note:** Keep your token secure and never commit it to version control!

**Optional for production:**
- Vercel deployment automatically enables Analytics
- Add `GITHUB_TOKEN` to your Vercel environment variables

### GitHub API Rate Limits

**With Authentication:**
- 5,000 requests per hour
- Sufficient for production use
- Per-token limit

**Caching Benefits:**
- First request: Fetches from GitHub
- Subsequent requests (< 1 hour): Served from cache
- Effectively: ~1 API call per username per hour

## 🐛 Troubleshooting

### Common Issues

**Widget not loading in Notion**
- Ensure URL is correct: `https://notion-github-widget.vercel.app/[username]`
- Check Notion embed block size (minimum 800px width recommended)
- Try refreshing the Notion page

**User not found error**
- Verify GitHub username is correct
- Username is case-sensitive
- User must exist on GitHub.com

**Rate limit errors**
- Wait for the rate limit to reset (1 hour)
- Caching should prevent most rate limit issues
- Consider deploying your own instance for higher limits

**Slow loading**
- First load fetches fresh data (slower)
- Cached requests are near-instant
- Check GitHub API status: https://www.githubstatus.com/

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm run lint && npm run build`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add TypeScript types for all functions
- Test with multiple usernames
- Ensure ESLint passes
- Update documentation if needed

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE) for details

## 🔗 Links

- **Live Demo**: [notion-github-widget.vercel.app](https://notion-github-widget.vercel.app)
- **GitHub Repository**: [github.com/kossakovsky/notion-github-widget](https://github.com/kossakovsky/notion-github-widget)
- **Report Issues**: [GitHub Issues](https://github.com/kossakovsky/notion-github-widget/issues)
- **GitHub API Docs**: [docs.github.com/graphql](https://docs.github.com/en/graphql)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [GitHub GraphQL API](https://docs.github.com/en/graphql)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)

---

Made with ❤️ for the GitHub community
