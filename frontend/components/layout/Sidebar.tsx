"use client";

import { CategoryDetails } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarProps {
  categories: CategoryDetails[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();
  // Initialize all categories as expanded
  const [expanded, setExpanded] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    categories.forEach((cat) => {
      init[cat.id] = true;
    });
    return init;
  });

  const toggleCategory = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (categories.length === 0) {
    return (
      <aside className="w-60 bg-white border-r border-gray-200 h-full overflow-y-auto shrink-0">
        <div className="p-4 text-sm text-gray-400">
          No categories loaded. Import data from the Admin page.
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 h-full overflow-y-auto shrink-0">
      {categories.map((cat) => {
        const isExpanded = expanded[cat.id] ?? true;
        return (
          <div key={cat.id}>
            <button
              onClick={() => toggleCategory(cat.id)}
              className="w-full bg-[#24408e] text-white px-4 py-2.5 text-sm font-semibold text-left uppercase flex justify-between items-center tracking-wide hover:bg-[#1d3472] transition-colors"
              aria-expanded={isExpanded}
            >
              <span className="flex items-center gap-2">
                {cat.name}
                <span className="text-[10px] font-normal bg-white/20 rounded-full px-1.5 py-0.5">
                  {cat.subCategories.length}
                </span>
              </span>
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>

            {isExpanded && (
              <div className="flex flex-col">
                {cat.subCategories.map((sub) => {
                  const href = `/category/${cat.id}/${sub.id}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={sub.id}
                      href={href}
                      className={`block px-4 py-2 text-[13px] border-b border-gray-100 transition-colors ${
                        isActive
                          ? "bg-[#24408e]/5 text-[#24408e] font-semibold border-l-[3px] border-l-[#24408e]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-[3px] border-l-transparent"
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
    </aside>
  );
}
