import { redirect } from "next/navigation";
import { fetchCategories, fetchCategoryDetails } from "@/services/serverApi";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await fetchCategories();
  
  if (categories && categories.length > 0) {
    const firstCat = categories[0];
    const catDetails = await fetchCategoryDetails(firstCat.id);
    if (catDetails.subCategories && catDetails.subCategories.length > 0) {
      redirect(`/category/${firstCat.id}/${catDetails.subCategories[0].id}`);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Welcome to the Catalog</h1>
      <p>No categories found or please select a category from the sidebar.</p>
    </div>
  );
}
