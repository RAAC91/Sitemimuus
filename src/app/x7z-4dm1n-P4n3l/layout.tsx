"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Users, Palette, Settings, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/x7z-4dm1n-P4n3l" },
  { name: "Orders", icon: ShoppingCart, href: "/x7z-4dm1n-P4n3l/orders" },
  { name: "Products", icon: Package, href: "/x7z-4dm1n-P4n3l/products" },
  { name: "Categories", icon: Palette, href: "/x7z-4dm1n-P4n3l/categories" },
  { name: "Customers", icon: Users, href: "/x7z-4dm1n-P4n3l/customers" },
  { name: "Theme", icon: Palette, href: "/x7z-4dm1n-P4n3l/theme" },
  { name: "Settings", icon: Settings, href: "/x7z-4dm1n-P4n3l/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-400">Loading Admin...</div>;
  if (!user) return null; // Will redirect

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-black tracking-tight text-gray-900">Mimuus Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-brand-pink transition-colors group"
              >
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-brand-pink/10 transition-colors">
                  <ArrowLeft size={20} className="text-gray-500 group-hover:text-brand-pink" />
                </div>
                <span className="font-medium">Voltar ao Site</span>
              </Link>
            </div>
          </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 w-full min-w-0">
        <div className="max-w-7xl mx-auto space-y-8">
            {children}
        </div>
      </main>
    </div>
  );
}
