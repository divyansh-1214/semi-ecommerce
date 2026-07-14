"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, LayoutGrid } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Catalog", icon: LayoutGrid },
    { href: "/admin", label: "Import", icon: Upload },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
      <Link href="/" className="text-lg font-bold text-[#24408e] tracking-wide">
        SPN Semi
      </Link>

      <nav className="flex items-center gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/category")
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-[#24408e]/10 text-[#24408e]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
