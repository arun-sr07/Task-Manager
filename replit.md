# Task Manager Dashboard

## Overview

A full-stack task management application built with React and Express. The application provides complete CRUD operations for tasks with audit logging, search/filtering, and pagination. It features a dark-themed UI inspired by Linear and Notion, with a focus on minimalist design and efficiency.

The application currently uses in-memory storage for tasks and audit logs, but is configured to support PostgreSQL through Drizzle ORM as indicated by the drizzle.config.ts configuration file.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React with TypeScript for type safety and component-based UI
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React Hook Form with Zod resolver for form state and validation
- Query invalidation pattern to keep UI in sync with server changes

**UI Component System**
- Shadcn UI component library with Radix UI primitives for accessibility
- Tailwind CSS for utility-first styling with custom design tokens
- Dark-first design system with carefully considered HSL color palette
- Custom CSS variables for theme consistency (backgrounds, borders, elevations)

**Design Philosophy**
- Minimalist, productivity-focused interface inspired by Linear and Notion
- Dark theme as primary interface with elevated surfaces for hierarchy
- Color-coded action badges (green for Create, amber for Update, red for Delete)
- Responsive design with mobile-first considerations

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API
- Modular controller pattern separating route handlers from business logic
- Middleware-based authentication using Basic Auth

**Data Layer**
- In-memory storage implementation via `MemStorage` class implementing `IStorage` interface
- Designed for easy swapping to persistent storage (PostgreSQL with Drizzle ORM configured)
- Separate storage for tasks and audit logs with auto-incrementing IDs

**API Design**
- RESTful endpoints for tasks (`/api/tasks`) and audit logs (`/api/logs`)
- Zod schema validation on all input endpoints
- Input sanitization to prevent HTML/script injection attacks
- Automatic audit log generation for all CRUD operations

**Security Measures**
- Basic Authentication on all API routes (username: `admin`, password: `password123`)
- Input validation with character limits (title: 100 chars, description: 500 chars)
- Pattern matching to reject HTML tags, script tags, and event handlers
- Sanitization functions to strip dangerous content

**Error Handling**
- Centralized error handling middleware
- Consistent JSON error responses with appropriate HTTP status codes
- Request/response logging for API debugging

### Data Models

**Task Schema**
- `id`: Auto-incrementing number
- `title`: Required string (max 100 characters)
- `description`: Optional string (max 500 characters)
- `createdAt`: ISO timestamp string

**Audit Log Schema**
- `id`: Auto-incrementing number
- `timestamp`: ISO timestamp string
- `action`: Enum of "Create", "Update", or "Delete"
- `taskId`: Reference to the affected task
- `updatedContent`: Nullable JSON string of new task content
- `notes`: Nullable additional information

### External Dependencies

**Core Runtime Dependencies**
- `@neondatabase/serverless`: PostgreSQL database driver (configured but not actively used)
- `drizzle-orm`: Type-safe SQL query builder and ORM
- `drizzle-zod`: Integration between Drizzle schemas and Zod validation
- `express`: Web application framework
- `zod`: Runtime type validation and schema definition

**Frontend Libraries**
- `@tanstack/react-query`: Data synchronization and caching
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Validation resolver integration
- `wouter`: Lightweight routing
- `date-fns`: Date formatting and manipulation
- `class-variance-authority`: Type-safe variant styling
- `clsx` + `tailwind-merge`: Conditional class name utilities

**UI Component Libraries**
- Multiple `@radix-ui/*` packages for accessible, unstyled primitives
- `cmdk`: Command palette component
- `embla-carousel-react`: Carousel functionality
- `lucide-react`: Icon library
- `vaul`: Drawer component

**Development Tools**
- `vite`: Build tool with HMR
- `@vitejs/plugin-react`: React support for Vite
- `@replit/vite-plugin-*`: Replit-specific development tooling
- `tsx`: TypeScript execution for Node.js
- `esbuild`: JavaScript bundler for production builds
- `drizzle-kit`: Database schema management and migrations

**Database Configuration**
- PostgreSQL connection via `DATABASE_URL` environment variable
- Drizzle schema defined in `shared/schema.ts`
- Migration files output to `./migrations` directory
- Currently not actively used (in-memory storage is active)