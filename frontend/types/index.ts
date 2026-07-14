// ─── Category List ────────────────────────────────────────────
// Matches GET /api/categories response shape (getAllCategories mapping)
export interface Category {
  id: number;
  name: string;
  subCategoryCount: number;
}

// ─── Category Detail ──────────────────────────────────────────
// Matches GET /api/categories/:id response shape
export interface CategoryDetails {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

// ─── SubCategory ──────────────────────────────────────────────
export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

// ─── Part Spec (mapped by response.mapper.ts) ─────────────────
// In the specs[] array: present means associated=true.
// value=null means dash cell, value="X" means filled cell.
// NOT present in the array means not associated (empty CSV cell).
export interface PartSpec {
  column: string;
  value: string | null;
}

// ─── Part ─────────────────────────────────────────────────────
export interface Part {
  partNo: string;
  datasheetUrl: string;
  specs: PartSpec[];
}

// ─── Paginated Parts Envelope ─────────────────────────────────
// Matches GET /api/subcategories/:id/parts response
export interface PaginatedParts {
  data: Part[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// ─── Spec Column ──────────────────────────────────────────────
// Matches GET /api/subcategories/:id/spec-columns response
export interface SpecColumn {
  id: number;
  name: string;
}

// ─── Import Report ────────────────────────────────────────────
// Matches POST /api/import success response
export interface ImportReport {
  status: string;
  rowsProcessed: number;
  rowsFailed: number;
  errors: string[];
}
