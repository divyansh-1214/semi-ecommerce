import { redirect } from "next/navigation";
import { fetchCategories, fetchCategoryDetails } from "@/services/serverApi";
import Link from "next/link";
import { Category } from "@/types";
import { Upload, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categories: Category[];
  try {
    categories = await fetchCategories();
  } catch {
    categories = [];
  }

  if (categories.length > 0) {
    const firstCat = categories[0];
    try {
      const catDetails = await fetchCategoryDetails(firstCat.id);
      if (catDetails.subCategories && catDetails.subCategories.length > 0) {
        redirect(`/category/${firstCat.id}/${catDetails.subCategories[0].id}`);
      }
    } catch {
      // Fall through to empty state
    }
  }

  // Empty state — no categories or failed to fetch details
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <Database className="text-gray-400" size={28} />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">No catalog data yet</h1>
        <p className="text-sm text-gray-500 mb-6">
          Import a CSV file to populate the product catalog with categories, subcategories, and part specifications.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#24408e] text-white text-sm font-medium rounded-md hover:bg-[#1d3472] transition-colors"
        >
          <Upload size={16} />
          Go to Import
        </Link>
      </div>
    </div>
  );
}
