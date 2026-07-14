# SPN Semi-Ecommerce

A full-stack product catalog system for semiconductor components with dynamic CSV data import capabilities.

## 🏗 Architecture Overview

The project is split into two distinct applications: a Node.js API backend and a Next.js React frontend.

### Backend (`/backend`)
- **Runtime:** Node.js
- **Framework:** Express.js (REST API architecture)
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Prisma
- **Data Ingestion:** Multer for file uploads, `csv-parser` for processing dynamic CSV files, and raw SQL bulk upserts for optimized database writes.
- **Role:** Exposes endpoints to import CSV data, fetch categories, and retrieve paginated components with dynamically mapped specification columns.

### Frontend (`/frontend`)
- **Framework:** Next.js (App Router, React Server Components)
- **Styling:** Tailwind CSS (Custom property-based design system)
- **State Management:** Zustand (with localStorage persistence) for global client state (e.g., sidebar expansion).
- **API Client:** Axios
- **Role:** Renders a fast, SEO-friendly UI. Uses SSR for fetching the catalog tree and component data, ensuring excellent initial load performance. Includes an Admin interface for uploading the CSV data.

---

## 📂 Project Structure

```
semi-ecommerce/
├── backend/                  # Express.js REST API
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/           # Express routers
│   │   ├── services/         # Business & DB logic (import, fetching)
│   │   └── server.ts         # App entry point
│   └── .env                  # Backend configuration
│
└── frontend/                 # Next.js Application
    ├── app/                  # Next.js App Router (pages, layouts)
    ├── components/           # Reusable UI components (Sidebar, Navbar, SpecCell)
    ├── lib/                  # Utilities (Axios config)
    ├── services/             # Server-side API fetch functions
    ├── store/                # Zustand global state
    ├── types/                # TypeScript interfaces sharing backend shapes
    └── .env                  # Frontend configuration
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (Local or managed like NeonDB)

### 1. Database & Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```
4. Push the database schema:
   ```bash
   npx prisma db push
   # Or run migrations: npx prisma migrate dev
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*

---

## 📖 Usage Guide

1. **Access the App**: Navigate to `http://localhost:3000` in your web browser.
2. **Initial State**: If the database is empty, you will be prompted to import data.
3. **Importing Data**:
   - Go to the **Import** page (via the top Navbar or `http://localhost:3000/admin`).
   - Upload your structured CSV file containing the parts data.
   - The system will process the file, extract dynamic specification columns (e.g., `VDSS V`, `VGS V`), and populate the database.
4. **Browsing the Catalog**:
   - Use the **Sidebar** to navigate through Categories and Subcategories.
   - The active subcategory will render a table showing the `Part No.` alongside its relevant, dynamically generated specification columns.
   - Missing data points in the CSV will elegantly render as `-` or completely blank depending on the association rules.
