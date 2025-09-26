# Menu Management System - Project Rules

## Project Overview

Full-stack menu management system with hierarchical menu structure using Next.js frontend and Nest.js backend.

## Technology Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend

- **Framework**: Nest.js
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript

## Project Structure

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (routes)/        # Route groups
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   └── features/       # Feature-specific components
│   ├── lib/                # Utilities and configurations
│   │   ├── redux/          # Redux store and slices
│   │   └── api/            # API layer
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── tailwind.config.js      # Tailwind configuration
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── app.module.ts       # Root module
│   ├── main.ts             # Application entry point
│   ├── modules/            # Feature modules
│   │   └── menu/           # Menu module
│   │       ├── menu.controller.ts
│   │       ├── menu.service.ts
│   │       ├── menu.module.ts
│   │       └── dto/        # Data Transfer Objects
│   ├── common/             # Shared utilities
│   │   ├── decorators/
│   │   ├── guards/
│   │   └── interceptors/
│   └── database/           # Database configurations
│       └── prisma/
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
└── test/                   # Test files
```

## Core Features Requirements

### 1. Menu CRUD Operations

- **GET /menus** - Retrieve all menus with hierarchical structure
- **GET /menus/:id** - Get specific menu with full depth and root items
- **POST /menus** - Create new menu
- **PUT /menus/:id** - Update existing menu
- **DELETE /menus/:id** - Delete menu
- **POST /menus/:id/save** - Save/persist menu changes

### 2. Menu Item Management

- **POST /menus/:menuId/items** - Add item hierarchically
- **PUT /menus/:menuId/items/:itemId** - Update menu item
- **DELETE /menus/:menuId/items/:itemId** - Delete menu item
- Maintain parent-child relationships
- Support unlimited nesting depth

### 3. Frontend Features

- Hierarchical menu display with tree structure
- Drag-and-drop for reordering (optional enhancement)
- Add/Edit/Delete items with modal forms
- Real-time updates using Redux state management
- Responsive design with Tailwind CSS

## Data Models

### Menu Model

```typescript
interface Menu {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  items: MenuItem[];
}
```

### MenuItem Model

```typescript
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  categoryId?: string;
  parentId?: string;
  menuId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  children: MenuItem[];
  parent?: MenuItem;
}
```

## Database Schema (Prisma)

```prisma
model Menu {
  id          String     @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  items       MenuItem[]
}

model MenuItem {
  id          String      @id @default(cuid())
  name        String
  description String?
  price       Float?
  parentId    String?
  menuId      String
  order       Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  menu        Menu        @relation(fields: [menuId], references: [id], onDelete: Cascade)
  parent      MenuItem?   @relation("MenuItemHierarchy", fields: [parentId], references: [id])
  children    MenuItem[]  @relation("MenuItemHierarchy")
}
```

## API Endpoints Structure

### Menu Endpoints

- `GET /api/menus` - List all menus
- `GET /api/menus/:id` - Get menu with hierarchy
- `POST /api/menus` - Create menu
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu
- `POST /api/menus/:id/save` - Save menu state

### Menu Item Endpoints

- `POST /api/menus/:menuId/items` - Add menu item
- `PUT /api/menus/:menuId/items/:itemId` - Update menu item
- `DELETE /api/menus/:menuId/items/:itemId` - Delete menu item
- `PUT /api/menus/:menuId/items/:itemId/move` - Move item in hierarchy

## Development Guidelines

### Code Standards

- Use TypeScript strictly with proper typing
- Follow ESLint and Prettier configurations
- Implement proper error handling and validation
- Use DTOs for API request/response validation
- Write unit tests for services and components

### File Naming Conventions

- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for functions and variables
- Use SCREAMING_SNAKE_CASE for constants

### Git Workflow

- Feature branches: `feature/menu-hierarchy`
- Commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

### Environment Variables

```env
# Backend
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Testing Requirements

- Unit tests for all services and utilities
- Integration tests for API endpoints
- Component testing for React components
- E2E tests for critical user flows

## Performance Considerations

- Implement pagination for large menu lists
- Use proper database indexing
- Optimize recursive queries for hierarchy
- Implement caching where appropriate
- Use React.memo for expensive components

## Security Guidelines

- Validate all input data using DTOs
- Implement proper CORS configuration
- Use helmet.js for security headers
- Sanitize database queries (Prisma handles this)
- Implement rate limiting for API endpoints

## Deployment Structure

- Separate Docker containers for frontend and backend
- Use environment-specific configurations
- Implement proper logging and monitoring
- Set up CI/CD pipeline for automated testing and deployment
