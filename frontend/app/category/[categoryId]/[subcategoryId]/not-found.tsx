import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Subcategory not found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The category or subcategory you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-[#24408e] text-white text-sm font-medium rounded-md hover:bg-[#1d3472] transition-colors inline-block"
        >
          Back to Catalog
        </Link>
      </div>
    </div>
  );
}
