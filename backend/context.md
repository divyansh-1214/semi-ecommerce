# Backend Context & Architecture

This document provides a high-level overview of the backend structure, architecture, and API design for the Semi-Ecommerce CSV Product Catalog project.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Prisma
- **Language:** TypeScript

## Architecture (MVC Pattern)
The project strictly follows a Model-View-Controller (MVC) architecture, breaking the business logic, routing, and HTTP responses into distinct layers.

- **Models:** Defined in `prisma/schema.prisma` and managed by Prisma Client.
- **Controllers (`src/controllers/`):** Handles incoming HTTP requests, performs basic input validation (e.g., `parseInt(id)`), calls the appropriate Service, formats the response, and manages error handling via `next(err)`.
- **Services (`src/services/`):** Contains the core business logic and interacts with the database via Prisma.
- **Routes (`src/routes/`):** Maps HTTP methods and endpoints to their respective Controller functions.
- **Middleware (`src/middleware/`):** Includes a centralized `errorHandler.ts` to format and return errors consistently (`{ error, code }`).
- **Utils (`src/utils/`):** Houses the `response.mapper.ts` responsible for flattening Prisma's nested relational query results into the final JSON structures required by the frontend API.

## Database Schema Highlights
- **Category:** Top-level categorization (e.g., Mosfet).
- **SubCategory:** Nested within a Category (e.g., SOT-723).
- **Part:** The core product entity, linked to a SubCategory. Contains `partNo` and `datasheetUrl`.
- **SpecColumn:** Represents the dynamic column headers from the CSV (e.g., `VDSS V`, `VGS V`).
- **PartSpec:** A many-to-many join table between `Part` and `SpecColumn` indicating what specs apply to a part.

### The PartSpec Association Logic
The core logic of the CSV import revolves around the `PartSpec` states:
1. **Filled Cell (Value):** `associated = true`, `value = "<value>"`.
2. **Dash (-) Cell:** `associated = true`, `value = null`. (The part has this spec column, but the value is missing).
3. **Empty Cell:** The cell is completely skipped. No `PartSpec` record is created, meaning the column is **not associated** with the part.

## API Endpoints

All endpoints are prefixed with `/api`.

### Import
- `POST /api/import`: Accepts a `multipart/form-data` CSV file upload. Parses the file, extracts dynamic `SpecColumn` headers, and upserts data. It processes rows sequentially without wrapping in a massive transaction, utilizing in-memory caches and chunked raw SQL bulk upserts for `PartSpec` to optimize database performance. It also handles empty row indicators and breaks on continuous blank rows.

### Categories
- `GET /api/categories`: Lists all categories alongside their subcategory counts.
- `GET /api/categories/:id`: Details of a specific category and its child subcategories.
- `GET /api/categories/:categoryId/subcategories`: Retrieves subcategories for a given category.

### SubCategories
- `GET /api/subcategories/:id`: SubCategory details alongside associated Part numbers.
- `GET /api/subcategories/:id/parts`: Returns a **paginated** list of parts under this subcategory, complete with fully mapped `specs` filtering out unassociated ones. Accepts `?page=1&limit=50`.
- `GET /api/subcategories/:id/spec-columns`: Returns only the `SpecColumn`s that are actively associated with at least one part in this specific subcategory.

### Parts
- `GET /api/parts`: Global part search supporting filters: `?category=x&subcategory=y&partNo=z`. Also supports pagination (`page`, `limit`).
- `GET /api/parts/:partNo`: Retrieve a single part by its unique part number, complete with mapped specs.

### Spec Columns
- `GET /api/spec-columns`: Retrieves the full dictionary of dynamic spec columns discovered during the CSV imports.


