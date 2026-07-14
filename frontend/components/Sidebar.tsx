"use client";

import { Category, SubCategory } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarProps {
  categories: Category[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();
  // Simple state to keep track of expanded categories
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleCategory = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="bg-[#24408e] text-white p-3 font-bold tracking-wider text-sm">
        PRODUCT
      </div>
      <div className="bg-[#4466b0] text-white p-3 font-semibold text-xs tracking-wide">
        POWER MANAGEMENT ICS(AC-DC/DC-DC)
      </div>
      
      <nav className="flex flex-col">
        {categories.map((cat) => {
          const isExpanded = expanded[cat.id] !== false; // default to expanded for demo
          return (
            <div key={cat.id} className="flex flex-col">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="bg-[#24408e] text-white p-3 font-bold text-sm text-left uppercase flex justify-between items-center"
              >
                {cat.name}
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {isExpanded && (
                <div className="flex flex-col py-2">
                  <div className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 cursor-pointer border-b border-gray-100">
                    Advanced Search
                  </div>
                  {cat.subCategories?.map((sub) => {
                    const href = `/category/${cat.id}/${sub.id}`;
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={sub.id}
                        href={href}
                        className={`px-4 py-2.5 text-sm transition-colors border-b border-gray-100 ${
                          isActive 
                            ? "bg-gray-200 text-gray-900 font-semibold border-l-4 border-l-gray-400" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-l-transparent"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
