import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { fetchCategories, fetchCategoryDetails } from "@/services/serverApi";
import { Category } from "@/types";

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
  title: "Semi-Ecommerce Product Catalog",
  description: "Browse product categories and specs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let fullCategories: Category[] = [];
  try {
    const basicCategories = await fetchCategories();
    // For each category, fetch details to get subCategories
    fullCategories = await Promise.all(
      basicCategories.map(async (cat) => {
        const details = await fetchCategoryDetails(cat.id);
        return details;
      })
    );
  } catch (error) {
    console.error("Error fetching categories for layout", error);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <div className="flex h-screen overflow-hidden">
          <Sidebar categories={fullCategories} />
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
