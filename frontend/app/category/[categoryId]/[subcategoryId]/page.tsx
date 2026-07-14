import { fetchCategoryDetails, fetchSubCategoryParts, fetchSubCategorySpecColumns } from "@/services/serverApi";
import { FileText, ChevronDown } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ categoryId: string, subcategoryId: string }>, 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { categoryId: cId, subcategoryId: sId } = await params;
  const resolvedSearchParams = await searchParams;
  const p = resolvedSearchParams.page;
  
  const categoryId = parseInt(cId);
  const subcategoryId = parseInt(sId);
  const page = p ? parseInt(p as string) : 1;
  const limit = 50;

  let categoryDetails = null;
  let partsResponse = null;
  let specColumns = [];
  
  try {
    [categoryDetails, partsResponse, specColumns] = await Promise.all([
      fetchCategoryDetails(categoryId),
      fetchSubCategoryParts(subcategoryId, page, limit),
      fetchSubCategorySpecColumns(subcategoryId)
    ]);
  } catch (error) {
    console.error("Failed to fetch data for subcategory", error);
    return <div className="p-8 text-red-500">Failed to load data. Please make sure the backend is running.</div>;
  }

  if (!partsResponse) {
    return <div className="p-8">Loading...</div>;
  }

  const subCategoryName = categoryDetails?.subCategories?.find(s => s.id === subcategoryId)?.name || "Unknown Subcategory";

  const totalPages = Math.ceil(partsResponse.meta.total / limit);

  return (
    <div className="p-6 max-w-[1200px]">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl text-[#24408e] tracking-wide">{subCategoryName}</h1>
        <ChevronDown className="ml-2 text-gray-500" />
      </div>

      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#e6ebf5] text-gray-700 text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 border-b border-gray-200">Part No.</th>
              {specColumns.map(col => (
                <th key={col.id} className="px-4 py-3 border-b border-gray-200 uppercase">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {partsResponse.data.map((part, idx) => (
              <tr key={part.partNo} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 border-b border-gray-100 flex items-center text-gray-700 font-medium">
                  {part.partNo}
                  {part.datasheetUrl && (
                    <a href={part.datasheetUrl} target="_blank" rel="noreferrer" className="ml-2 text-red-500 hover:text-red-600 transition-colors">
                      <FileText size={16} />
                    </a>
                  )}
                </td>
                {specColumns.map(col => {
                  const spec = part.specs.find(s => s.column === col.name);
                  return (
                    <td key={col.id} className="px-4 py-3 border-b border-gray-100 text-gray-600">
                      {spec && spec.value !== null ? spec.value : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
            {partsResponse.data.length === 0 && (
              <tr>
                <td colSpan={specColumns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  No parts found in this subcategory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Link
            href={`/category/${categoryId}/${subcategoryId}?page=${Math.max(1, page - 1)}`}
            className={`px-4 py-2 border rounded ${page === 1 ? 'text-gray-400 bg-gray-100 pointer-events-none' : 'text-blue-600 hover:bg-blue-50 border-blue-200'}`}
          >
            Previous
          </Link>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <Link
            href={`/category/${categoryId}/${subcategoryId}?page=${Math.min(totalPages, page + 1)}`}
            className={`px-4 py-2 border rounded ${page === totalPages ? 'text-gray-400 bg-gray-100 pointer-events-none' : 'text-blue-600 hover:bg-blue-50 border-blue-200'}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
