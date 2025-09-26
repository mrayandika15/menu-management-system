# Menu Management System - Project Rules

## Project Overview

Full-stack menu management system with **multi-level hierarchical menu structure** supporting unlimited depth nesting. The system allows creating complex menu trees with parent-child relationships at any level, featuring expandable/collapsible navigation, drag-and-drop reordering, and real-time hierarchy management using Next.js frontend and Nest.js backend.

### Key Hierarchy Features

- **Unlimited Depth**: Support for infinite levels of menu nesting (System Management → Systems → System Code → Code Registration → etc.)
- **Tree Navigation**: Expandable/collapsible menu items with visual indicators
- **Hierarchical Operations**: Add, edit, delete, and move items within the tree structure
- **Parent-Child Relationships**: Maintain proper relationships with cascade operations
- **Order Management**: Preserve item ordering within each hierarchy level

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

#### Core Hierarchy Features

- **Tree Structure Display**: Hierarchical menu display with unlimited depth nesting
- **Expand/Collapse Navigation**: Interactive tree nodes with expand/collapse functionality
- **Visual Depth Indicators**: Indentation and connecting lines to show hierarchy levels
- **Breadcrumb Navigation**: Show current item path from root to selected item
- **Drag-and-Drop Reordering**: Move items between different hierarchy levels
- **Real-time Updates**: Redux state management for instant UI updates

#### Tree Navigation Components

- **TreeView Component**: Main hierarchical display with expand/collapse controls
- **TreeNode Component**: Individual menu item with children support
- **TreeControls**: Expand all, collapse all, search, and filter controls
- **DepthIndicator**: Visual representation of nesting level
- **PathBreadcrumb**: Full path display from root to current item

#### Interactive Features

- **Context Menus**: Right-click actions for add, edit, delete, move operations
- **Keyboard Navigation**: Arrow keys for tree navigation, Enter to expand/collapse
- **Search and Filter**: Find items across all hierarchy levels
- **Bulk Selection**: Multi-select items for bulk operations
- **Undo/Redo**: Action history for hierarchy changes

#### UI/UX Enhancements

- **Loading States**: Skeleton loaders for deep hierarchy loading
- **Virtual Scrolling**: Performance optimization for large trees
- **Responsive Design**: Mobile-friendly tree navigation with touch gestures
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Theme Support**: Dark/light mode with proper contrast for tree lines

#### State Management

```typescript
// Redux slice for menu hierarchy state
interface MenuHierarchyState {
  menus: Menu[];
  currentMenu?: Menu;
  expandedItems: Set<string>;
  selectedItems: Set<string>;
  draggedItem?: string;
  dropTarget?: string;
  searchQuery: string;
  filterDepth?: number;
  isLoading: boolean;
  error?: string;
}

// Actions for hierarchy management
const menuHierarchySlice = {
  expandItem: (itemId: string) => void;
  collapseItem: (itemId: string) => void;
  toggleExpansion: (itemId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  selectItem: (itemId: string) => void;
  moveItem: (itemId: string, targetParentId: string, newOrder: number) => void;
  setSearchQuery: (query: string) => void;
  setFilterDepth: (depth: number) => void;
}
```

## Data Models

### Menu Model

```typescript
interface Menu {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  items: MenuItem[];
  rootItems: MenuItem[]; // Top-level items (parentId = null)
  maxDepth?: number; // Optional depth limit
}
```

### MenuItem Model

```typescript
interface MenuItem {
  id: string;
  name: string;
  parentId?: string; // null for root items
  menuId: string;
  order: number; // Order within the same parent level
  depth: number; // Current depth level (0 for root)
  path: string; // Full path from root (e.g., "1.2.3")
  isExpanded?: boolean; // UI state for tree navigation
  hasChildren: boolean; // Computed field for performance
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  children: MenuItem[]; // Direct children
  parent?: MenuItem; // Direct parent
  menu: Menu;

  // Computed properties for hierarchy
  ancestors: MenuItem[]; // All parent items up to root
  descendants: MenuItem[]; // All child items recursively
  siblings: MenuItem[]; // Items with same parent
  level: number; // Alternative to depth
}
```

### Hierarchy Helper Types

```typescript
interface MenuTreeNode extends MenuItem {
  children: MenuTreeNode[];
  isLeaf: boolean;
  isRoot: boolean;
}

interface HierarchyOperation {
  type: "move" | "add" | "delete" | "reorder";
  itemId: string;
  targetParentId?: string;
  newOrder?: number;
  affectedItems: string[]; // Items that need path/order updates
}

interface TreeState {
  expandedItems: Set<string>;
  selectedItem?: string;
  draggedItem?: string;
  dropTarget?: string;
}
```

## Database Schema (Prisma)

```prisma
model Menu {
  id          String     @id @default(cuid())
  name        String
  maxDepth    Int?       @default(10) // Optional depth limit for performance
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  items       MenuItem[]

  @@map("menus")
}

model MenuItem {
  id          String      @id @default(cuid())
  name        String
  parentId    String?     // null for root items
  menuId      String
  order       Int         @default(0) // Order within same parent level
  depth       Int         @default(0) // Current depth level (0 for root)
  path        String      @default("") // Materialized path (e.g., "1.2.3")
  hasChildren Boolean     @default(false) // Computed field for performance
  isActive    Boolean     @default(true) // Soft delete support
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relationships
  menu        Menu        @relation(fields: [menuId], references: [id], onDelete: Cascade)
  parent      MenuItem?   @relation("MenuItemHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children    MenuItem[]  @relation("MenuItemHierarchy")

  // Indexes for performance optimization
  @@index([menuId, parentId]) // Fast parent-child queries
  @@index([menuId, depth]) // Fast depth-based queries
  @@index([path]) // Fast path-based queries for ancestors/descendants
  @@index([menuId, order]) // Fast ordering queries
  @@index([parentId, order]) // Fast sibling ordering
  @@map("menu_items")
}

// Optional: Materialized view for better performance on deep hierarchies
model MenuItemClosure {
  id         String @id @default(cuid())
  ancestorId String
  descendantId String
  depth      Int    // Distance between ancestor and descendant

  ancestor   MenuItem @relation("Ancestor", fields: [ancestorId], references: [id], onDelete: Cascade)
  descendant MenuItem @relation("Descendant", fields: [descendantId], references: [id], onDelete: Cascade)

  @@unique([ancestorId, descendantId])
  @@index([ancestorId])
  @@index([descendantId])
  @@index([depth])
  @@map("menu_item_closures")
}
```

### Database Optimization Notes

1. **Materialized Path**: The `path` field stores the full hierarchy path (e.g., "1.2.3.4") for efficient ancestor/descendant queries
2. **Depth Field**: Enables fast depth-based filtering and prevents infinite recursion
3. **hasChildren**: Computed field to avoid expensive COUNT queries in UI
4. **Closure Table** (Optional): For very deep hierarchies, provides O(1) ancestor/descendant lookups
5. **Composite Indexes**: Optimized for common query patterns in hierarchical data
6. **Cascade Deletes**: Maintains referential integrity when deleting parent items

## API Endpoints Structure

### Menu Endpoints

- `GET /api/menus` - List all menus with basic info
- `GET /api/menus/:id` - Get menu with full hierarchy tree
- `GET /api/menus/:id/tree` - Get menu as nested tree structure
- `GET /api/menus/:id/flat` - Get menu as flat list with depth indicators
- `POST /api/menus` - Create new menu
- `PUT /api/menus/:id` - Update menu metadata
- `DELETE /api/menus/:id` - Delete menu and all items
- `POST /api/menus/:id/save` - Save/persist menu changes

### Menu Item Endpoints

#### Basic CRUD Operations

- `POST /api/menus/:menuId/items` - Add menu item (specify parentId for hierarchy)
- `PUT /api/menus/:menuId/items/:itemId` - Update menu item
- `DELETE /api/menus/:menuId/items/:itemId` - Delete menu item and all children
- `GET /api/menus/:menuId/items/:itemId` - Get single item with children

#### Hierarchy Management

- `PUT /api/menus/:menuId/items/:itemId/move` - Move item to new parent/position
- `PUT /api/menus/:menuId/items/:itemId/reorder` - Reorder items within same parent
- `GET /api/menus/:menuId/items/:itemId/ancestors` - Get all parent items up to root
- `GET /api/menus/:menuId/items/:itemId/descendants` - Get all child items recursively
- `GET /api/menus/:menuId/items/:itemId/siblings` - Get items with same parent
- `GET /api/menus/:menuId/items/:itemId/path` - Get full path from root to item

#### Tree Operations

- `POST /api/menus/:menuId/items/:itemId/expand` - Mark item as expanded (UI state)
- `POST /api/menus/:menuId/items/:itemId/collapse` - Mark item as collapsed (UI state)
- `POST /api/menus/:menuId/expand-all` - Expand all items in menu
- `POST /api/menus/:menuId/collapse-all` - Collapse all items in menu
- `GET /api/menus/:menuId/items/roots` - Get only root-level items
- `GET /api/menus/:menuId/items/depth/:level` - Get items at specific depth level

#### Bulk Operations

- `POST /api/menus/:menuId/items/bulk-create` - Create multiple items with hierarchy
- `PUT /api/menus/:menuId/items/bulk-update` - Update multiple items
- `DELETE /api/menus/:menuId/items/bulk-delete` - Delete multiple items
- `POST /api/menus/:menuId/items/bulk-move` - Move multiple items to new parent

### Query Parameters for Hierarchy

```typescript
// Common query parameters for tree operations
interface HierarchyQueryParams {
  depth?: number; // Limit depth of returned tree
  includeChildren?: boolean; // Include child items
  expandedOnly?: boolean; // Only return expanded items
  maxDepth?: number; // Maximum depth to traverse
  orderBy?: "order" | "name" | "createdAt";
  sortDirection?: "asc" | "desc";
}

// Example: GET /api/menus/123/tree?depth=3&includeChildren=true&orderBy=order
```

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

### Hierarchy-Specific Optimizations

- **Lazy Loading**: Load child items on-demand when parent is expanded
- **Virtual Scrolling**: Render only visible tree nodes for large hierarchies
- **Materialized Paths**: Use path-based queries for fast ancestor/descendant lookups
- **Depth Limiting**: Configurable maximum depth to prevent infinite recursion
- **Caching Strategy**: Cache frequently accessed tree branches in Redis

### Database Performance

- **Composite Indexes**: Optimized indexes for parent-child and depth-based queries
- **Closure Table**: Optional closure table for O(1) hierarchy queries on deep trees
- **Batch Operations**: Bulk insert/update/delete for hierarchy changes
- **Connection Pooling**: Efficient database connection management for recursive queries

### Frontend Performance

- **React.memo**: Memoize tree components to prevent unnecessary re-renders
- **useMemo/useCallback**: Optimize expensive tree calculations and event handlers
- **Debounced Search**: Prevent excessive API calls during tree search
- **State Normalization**: Flatten Redux state for efficient updates
- **Code Splitting**: Lazy load tree components and hierarchy utilities

### API Optimization

- **Pagination**: Implement cursor-based pagination for large tree branches
- **Field Selection**: Allow clients to specify which fields to return
- **Compression**: Enable gzip compression for large tree responses
- **ETags**: Implement caching headers for unchanged tree structures
- **Rate Limiting**: Prevent abuse of expensive hierarchy operations

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
