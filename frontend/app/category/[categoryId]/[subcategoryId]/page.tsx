import { fetchCategoryDetails, fetchSubCategoryParts, fetchSubCategorySpecColumns } from "@/services/serverApi";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpecCell from "@/components/ui/SpecCell";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ categoryId: string; subcategoryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryId: cId, subcategoryId: sId } = await params;
  const resolvedSearchParams = await searchParams;
  const p = resolvedSearchParams.page;

  const categoryId = parseInt(cId);
  const subcategoryId = parseInt(sId);

  if (isNaN(categoryId) || isNaN(subcategoryId)) {
    notFound();
  }

  const page = p ? parseInt(p as string) : 1;
  const limit = 50;

  // Step 1: Fetch spec columns first (defines the canonical header row)
  // Step 2: Fetch parts + category details in parallel
  const [categoryDetails, specColumns, partsResponse] = await Promise.all([
    fetchCategoryDetails(categoryId),
    fetchSubCategorySpecColumns(subcategoryId),
    fetchSubCategoryParts(subcategoryId, page, limit),
  ]);

  // Validate that the category and subcategory exist
  if (!categoryDetails) {
    notFound();
  }

  const subCategory = categoryDetails.subCategories?.find(
    (s) => s.id === subcategoryId
  );

  if (!subCategory) {
    notFound();
  }

  const totalPages = Math.ceil(partsResponse.meta.total / limit);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-gray-700">{categoryDetails.name}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{subCategory.name}</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#24408e] mb-6 tracking-wide">
        {subCategory.name}
      </h1>

      {/* Parts Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#e6ebf5] text-gray-700 text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 border-b border-gray-200">Part No.</th>
              {specColumns.map((col) => (
                <th
                  key={col.id}
                  className="px-4 py-3 border-b border-gray-200"
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partsResponse.data.map((part, idx) => (
              <tr
                key={part.partNo}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-4 py-3 border-b border-gray-100 text-gray-800 font-medium">
                  <span className="inline-flex items-center gap-2">
                    {part.partNo}
                    {part.datasheetUrl && (
                      <a
                        href={part.datasheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-500 hover:text-red-600 transition-colors"
                        aria-label={`Download datasheet for ${part.partNo}`}
                      >
                        <FileText size={15} />
                      </a>
                    )}
                  </span>
                </td>
                {specColumns.map((col) => (
                  <SpecCell
                    key={col.id}
                    specs={part.specs}
                    columnName={col.name}
                  />
                ))}
              </tr>
            ))}
            {partsResponse.data.length === 0 && (
              <tr>
                <td
                  colSpan={specColumns.length + 1}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  No parts found in this subcategory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Link
            href={`/category/${categoryId}/${subcategoryId}?page=${Math.max(1, page - 1)}`}
            className={`inline-flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              page === 1
                ? "text-gray-300 border-gray-200 pointer-events-none"
                : "text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
            aria-disabled={page === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </Link>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <Link
                  key={pageNum}
                  href={`/category/${categoryId}/${subcategoryId}?page=${pageNum}`}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    pageNum === page
                      ? "bg-[#24408e] text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/category/${categoryId}/${subcategoryId}?page=${Math.min(totalPages, page + 1)}`}
            className={`inline-flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              page === totalPages
                ? "text-gray-300 border-gray-200 pointer-events-none"
                : "text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
            aria-disabled={page === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Total count */}
      <p className="text-xs text-gray-400 mt-3">
        Showing {partsResponse.data.length} of {partsResponse.meta.total} parts
      </p>
    </div>
  );
}
