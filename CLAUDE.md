# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application built with React 19, TypeScript, and Tailwind CSS 4. The project is bootstrapped with `create-next-app` and uses the App Router architecture.

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
- Main page: `app/page.tsx` - the homepage component
- Global styles: `app/globals.css` - Tailwind CSS imports and CSS variables for theming

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

## Key Files

- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint flat config with Next.js presets
- `tsconfig.json` - TypeScript compiler options
- `postcss.config.mjs` - PostCSS configuration for Tailwind
- `app/layout.tsx` - Root layout with metadata and font configuration
- `app/page.tsx` - Homepage component
- `app/globals.css` - Global styles and Tailwind imports
