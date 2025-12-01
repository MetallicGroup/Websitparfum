# Overview

This is a full-stack e-commerce platform for selling luxury perfumes, built with a modern React frontend and Express backend. The application features a Romanian-language interface targeting the luxury fragrance market with three main product categories: women's, men's, and unisex perfumes. The platform includes a complete shopping cart system, checkout flow with WhatsApp order notifications, and a minimalist luxury design aesthetic.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript using Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- Component library based on Radix UI primitives with shadcn/ui styling patterns
- Tailwind CSS v4 (using `@import "tailwindcss"`) for styling with custom luxury theme

**State Management**
- React Context API for cart state management (CartContext)
- TanStack Query (React Query) for server state and API communication
- React Hook Form with Zod for form validation and management

**Design System**
- Custom luxury minimalist theme with Playfair Display (serif) for headings and Montserrat (sans-serif) for body text
- Color scheme: off-white backgrounds, soft black text, gold/bronze accents
- Motion and animations powered by Framer Motion
- Responsive design using Tailwind's mobile-first approach

**Key Features**
- Product catalog with filtering and search capabilities
- Shopping cart with localStorage persistence
- Dynamic shipping cost calculation (free shipping over 250 lei threshold)
- Category-based navigation (women/men/unisex)
- Checkout flow with Romanian form validation

## Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- HTTP server created using Node's native `http` module
- RESTful API design pattern

**Development vs Production**
- Development: Vite middleware integration for HMR (Hot Module Replacement)
- Production: Serves pre-built static assets from dist/public directory
- Custom build script using esbuild for server bundling and Vite for client bundling

**API Endpoints**
- `POST /api/orders` - Create new order with customer details and cart items
- Order data validated using Zod schemas before database insertion

**Session & Request Handling**
- JSON body parsing with raw body preservation for webhook verification
- Request logging middleware with timestamp and duration tracking
- CORS and security headers (implied by Express best practices)

## Data Layer

**Database**
- PostgreSQL via Neon serverless (cloud-hosted)
- Connection pooling using `@neondatabase/serverless` with WebSocket support
- WebSocket constructor override using `ws` package for serverless compatibility

**ORM & Schema Management**
- Drizzle ORM for type-safe database queries
- Schema definition in `shared/schema.ts` for sharing between client and server
- Drizzle Kit for migrations (output to `./migrations` directory)

**Data Models**
- Orders table with fields:
  - Customer information (name, phone, address, city, county, postal code)
  - Products array stored as JSONB (denormalized for order history)
  - Pricing fields (total, shipping cost, grand total)
  - Status field (default: "pending")
  - Timestamps with automatic creation tracking

**Schema Validation**
- Zod schemas generated from Drizzle tables using `drizzle-zod`
- Runtime validation on both client and server
- Type safety ensured through TypeScript inference

## External Dependencies

**Third-Party Services**
- **WhatsApp Business API** - Order notifications sent to customer via WhatsApp using Meta's Graph API (v21.0)
  - Template-based messaging in Romanian language
  - Requires: `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` environment variables

**Database Service**
- **Neon Database** - Serverless PostgreSQL hosting
  - Requires: `DATABASE_URL` environment variable
  - WebSocket-based connections for serverless deployment compatibility

**Development Tools (Replit-specific)**
- `@replit/vite-plugin-runtime-error-modal` - Development error overlay
- `@replit/vite-plugin-cartographer` - Code mapping for Replit IDE
- `@replit/vite-plugin-dev-banner` - Development environment banner
- Custom Vite plugin for OpenGraph image meta tag updates based on Replit deployment URL

**UI Component Dependencies**
- Radix UI primitives for accessible components (accordion, dialog, dropdown, etc.)
- Embla Carousel for image carousels
- Lucide React for icons
- cmdk for command palette functionality

**Utility Libraries**
- `class-variance-authority` - Component variant management
- `clsx` and `tailwind-merge` - Conditional CSS class handling
- `date-fns` - Date formatting and manipulation
- `nanoid` - Unique ID generation
- `zod-validation-error` - Human-readable validation error messages

**Build & Development**
- TypeScript with strict mode enabled
- Path aliases configured: `@/` for client source, `@shared/` for shared code, `@assets/` for attached assets
- ESM modules throughout the project
- PostCSS with Autoprefixer for CSS processing