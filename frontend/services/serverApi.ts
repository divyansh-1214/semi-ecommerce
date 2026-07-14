import { api } from "@/lib/api";
import { Category, CategoryDetails, ImportReport, PaginatedParts, SpecColumn } from "@/types";
import { AxiosError } from "axios";

function extractErrorMessage(err: unknown): string {
  if (err instanceof AxiosError && err.response?.data?.error) {
    return err.response.data.error;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred";
}

// ─── Categories ───────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await api.get<Category[]>("/api/categories");
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function fetchCategoryDetails(id: number): Promise<CategoryDetails> {
  try {
    const res = await api.get<CategoryDetails>(`/api/categories/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

// ─── SubCategories ────────────────────────────────────────────

export async function fetchSubCategoryParts(
  id: number,
  page: number = 1,
  limit: number = 50
): Promise<PaginatedParts> {
  try {
    const res = await api.get<PaginatedParts>(`/api/subcategories/${id}/parts`, {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function fetchSubCategorySpecColumns(id: number): Promise<SpecColumn[]> {
  try {
    const res = await api.get<SpecColumn[]>(`/api/subcategories/${id}/spec-columns`);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

// ─── Import ───────────────────────────────────────────────────

export async function fetchImportCSV(formData: FormData): Promise<ImportReport> {
  try {
    const res = await api.post<ImportReport>("/api/import", formData);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}
