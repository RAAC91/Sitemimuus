"use client";

import { usePathname } from "next/navigation";

export function SiteBackground() {
  const pathname = usePathname();

  // Don't show on home page
  if (pathname === "/") return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#00F5FF]/6 blur-[140px] rounded-full animate-pulse"></div>
      <div className="absolute top-[30%] -right-[10%] w-[45%] h-[45%] bg-[#FF00E5]/5 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#E5E7EB]/10 blur-[140px] rounded-full"></div>
    </div>
  );
}
