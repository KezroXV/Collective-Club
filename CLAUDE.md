# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Collective Club is a Shopify app that provides a forum community platform for Shopify stores. The project has a complex structure with both root-level and nested configurations due to the presence of a duplicate forum-shopify-app directory.

**Active Development Path**: `web/frontend/` (root level)
**Deprecated Path**: `forum-shopify-app/collective-club/web/frontend/` (legacy duplicate)

## Development Commands

### Shopify App Commands (Root Level)
- `npm run dev` - Start Shopify app development server
- `npm run build` - Build the Shopify app
- `shopify app dev` - Alternative development command
- `shopify app deploy` - Deploy the app

### Frontend Development (web/frontend/)
- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js TypeScript rules

### Database Commands
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open Prisma Studio database browser

## Architecture

### Technology Stack
- **Shopify App**: Built with Shopify CLI and Partners API
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5
- **UI Libraries**: Radix UI components, Tailwind CSS v4, Lucide React icons
- **Database**: PostgreSQL with Prisma ORM
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Turbopack for fast development builds

### Project Structure
```
├── web/frontend/           # Main Next.js application
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── community/     # Community pages
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   ├── prisma/           # Database schema and migrations
│   └── lib/              # Utility functions
├── extensions/           # Shopify app extensions
└── shopify.app.toml     # Shopify app configuration
```

### Database Schema (Prisma)
Core models:
- **User**: Shopify store owners/admins with shop integration
- **Post**: Forum posts with title, content, images, categories
- **Comment**: Threaded comments on posts
- **Reaction**: Like/emoji reactions on posts and comments

Key relationships:
- Users linked to Shopify stores via `shopDomain` (unique)
- Posts belong to users with cascade deletion
- Reactions are unique per user-post/comment combination

### API Routes Architecture
- `api/auth/shopify/` - Shopify OAuth authentication
- `api/auth/callback/` - OAuth callback handler  
- `api/users/` - User CRUD operations
- `api/posts/` - Post management with nested routes for comments and reactions
- `api/posts/[id]/comments/` - Comment management
- `api/posts/[id]/reactions/` - Reaction management

### Frontend Architecture
- **Client Components**: User authentication, post filtering, interactive UI
- **Server Components**: Static content, SEO-optimized pages
- **State Management**: React useState for local state, localStorage for user persistence
- **Authentication Flow**: Shopify OAuth → User creation/update → Session storage

### Shopify Integration
- OAuth scopes: `read_content`, `read_customers`, `write_content`, `write_customers`
- API version: 2025-07
- Authentication handled via Shopify Partners API
- User accounts automatically created from Shopify store domains

## Configuration Notes

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SHOPIFY_API_KEY` - From shopify.app.toml client_id
- `SHOPIFY_API_SECRET` - Shopify app secret
- `HOST` - Application host URL (http://localhost:3000/ for dev)

### Key Configuration Files
- `shopify.app.toml` - Shopify app settings and OAuth configuration
- `prisma/schema.prisma` - Database schema with PostgreSQL provider
- `next.config.ts` - Next.js configuration with Turbopack
- `tailwind.config.js` - Tailwind CSS v4 configuration
- `tsconfig.json` - TypeScript with path aliases (`@/*` → `./`)

### Development Workflow
1. Start with `npm run dev` in root for Shopify app development
2. Navigate to `web/frontend/` for frontend-specific changes
3. Use Prisma Studio for database inspection during development
4. Test OAuth flow with actual Shopify store for authentication
5. Run `npm run lint` before committing frontend changes

## Important Notes

### Duplicate Directory Issue
There is a duplicate `forum-shopify-app/collective-club/` directory that appears to be a legacy copy. Always work in the root-level `web/frontend/` directory for active development.

### Authentication Flow
The app expects Shopify OAuth parameters (`shop`, `hmac`) in URL query params to automatically create/authenticate users. Without these, it falls back to localStorage for demo purposes.

### French Localization
The application is primarily configured for French language (`lang="fr"` in layout, French date formatting, French UI text).