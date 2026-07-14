<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend Architecture & Context (SPN Semi-Ecommerce)

This document provides a high-level overview of the frontend structure, architecture, and state management for the Semi-Ecommerce Product Catalog project.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom properties for brand colors)
- **State Management:** Zustand (with persist middleware)
- **API Client:** Axios (configured in `lib/api.ts`)
- **Icons:** Lucide React

## Core Architecture
The frontend embraces the Next.js App Router paradigm, heavily utilizing React Server Components (RSC) for data fetching and performance, while isolating interactivity into explicitly marked Client Components (`"use client"`).

### 1. Folder Structure
- `app/` — Next.js file-based routing, layouts, error boundaries, and loading states.
- `components/`
  - `layout/` — Shared structural components (`Navbar`, `Sidebar`).
  - `ui/` — Reusable elements (`Loader`, `TableSkeleton`, `SpecCell`).
- `lib/` — Core utilities (`api.ts` Axios configuration).
- `services/` — Server-side API fetching functions (`serverApi.ts`).
- `store/` — Global state management (`useSidebarStore.ts`).
- `types/` — TypeScript contracts matching the backend API responses.

### 2. State Management (Zustand)
The application uses Zustand for global client-side state.
- **Store (`useSidebarStore.ts`)**: Manages the expanded/collapsed state of the category sidebar.
- **Persistence**: Uses the `persist` middleware to save state to `localStorage` (`sidebar-state`).
- **Hydration Safety**: The `Sidebar` component utilizes a `mounted` state check. During Server-Side Rendering (SSR) and initial hydration, it falls back to a deterministic state (e.g., expanding only the active category from the URL). Once mounted, it reads from the local storage store. This strictly prevents React hydration mismatch errors.

### 3. Data Fetching & Routing
- **`app/layout.tsx` (Server Component)**:
  - Fetches the full list of categories (`fetchCategories` + `fetchCategoryDetails`) on the server.
  - Passes the fetched data down to the `Sidebar` Client Component as props.
- **`app/page.tsx` (Server Component)**:
  - The catalog homepage.
  - Checks if categories exist in the database. If yes, it displays a "Welcome" screen instructing the user to select a category. If no, it displays an empty state directing them to the Admin import page.
- **`app/category/[categoryId]/[subcategoryId]/page.tsx` (Server Component)**:
  - The core data table view.
  - Fetches `CategoryDetails`, `SpecColumns`, and paginated `Parts` in parallel.
  - **Dynamic Column Derivation**: The table header (`<th>`) is strictly derived from the `/api/subcategories/:id/spec-columns` endpoint, ensuring a canonical, consistent grid.
- **`app/admin/page.tsx` (Client Component)**:
  - Handles the CSV file upload.
  - Displays a detailed `ImportReport` card upon success, tracking rows processed, rows failed, and an error list.

### 4. SpecCell Rendering Logic
The `PartSpec` data is inherently sparse. A core requirement is correctly visualizing the presence or absence of data.
The `SpecCell` component handles three distinct states:
1. **Empty (Not Associated)**: The column does not exist in the part's `specs` array. Renders as a completely blank cell.
2. **Dash (`-`)**: The column exists in the array, but `value === null`. Renders as `-`.
3. **Filled**: The column exists and has a value. Renders the exact text/value.

### 5. Error Boundaries & Loading
- **Loading (`loading.tsx`)**: The root layout uses a spinner (`Loader`). The category route uses a highly optimized `TableSkeleton` (shimmer effect) mimicking the table grid during data fetches.
- **Error Boundaries (`error.tsx`)**: Catch unexpected API or rendering failures, providing contextual error messages and recovery buttons ("Try Again").
- **Not Found (`not-found.tsx`)**: The category page explicitly calls `notFound()` when an invalid ID is passed in the URL, gracefully rendering a "Subcategory not found" view.
