import { api } from "./api";
import { Category, PaginatedParts, SpecColumn } from "../types";

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>("/api/categories");
  return res.data;
}

export async function fetchCategoryDetails(id: number): Promise<Category> {
  const res = await api.get<Category>(`/api/categories/${id}`);
  return res.data;
}

export async function fetchSubCategoryParts(id: number, page: number = 1, limit: number = 50): Promise<PaginatedParts> {
  const res = await api.get<PaginatedParts>(`/api/subcategories/${id}/parts`, {
    params: { page, limit }
  });
  return res.data;
}

export async function fetchSubCategorySpecColumns(id: number): Promise<SpecColumn[]> {
  const res = await api.get<SpecColumn[]>(`/api/subcategories/${id}/spec-columns`);
  return res.data;
}
