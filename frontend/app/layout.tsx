import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { fetchCategories, fetchCategoryDetails } from "@/services/serverApi";
import { CategoryDetails } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SPN Semi — Product Catalog",
  description: "Browse semiconductor product categories, parts, and specifications",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let fullCategories: CategoryDetails[] = [];
  try {
    const basicCategories = await fetchCategories();
    fullCategories = await Promise.all(
      basicCategories.map(async (cat) => {
        const details = await fetchCategoryDetails(cat.id);
        return details;
      })
    );
  } catch (error) {
    console.error("Error fetching categories for layout:", error);
    // Sidebar will show empty state
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full bg-white text-gray-900 antialiased">
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar categories={fullCategories} />
            <main className="flex-1 overflow-y-auto bg-gray-50/30">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
