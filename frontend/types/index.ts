export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  subCategories?: SubCategory[];
  _count?: {
    SubCategory: number;
  };
}

export interface PartSpec {
  column: string;
  value: string | null;
}

export interface Part {
  partNo: string;
  datasheetUrl: string;
  specs: PartSpec[];
}

export interface PaginatedParts {
  data: Part[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface SpecColumn {
  id: number;
  name: string;
}
