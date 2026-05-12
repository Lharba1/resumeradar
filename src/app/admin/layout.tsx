import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import Link from "next/link";

const NAV = [
  { href: "/admin",            label: "Overview",   icon: "◈",  badge: null },
  { href: "/admin/users",      label: "Users",      icon: "👥", badge: null },
  { href: "/admin/plans",      label: "Plans",      icon: "💳", badge: null },
  { href: "/admin/ai-config",  label: "AI Config",  icon: "⚡", badge: null },
  { href: "/admin/ai-spend",   label: "AI Spend",   icon: "📊", badge: null },
  { href: "/admin/billing",    label: "Billing",    icon: "💰", badge: "TODO" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { forbidden } = await requireAdmin();
  if (forbidden) redirect("/");

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-[#E2E8F0] bg-white">
        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-[10px] font-black text-white">A</div>
            <span className="text-sm font-bold text-[#131f2f]">Admin</span>
            <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-500">PRIVATE</span>
          </div>
        </div>
        <nav className="p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[#3B4959] transition hover:bg-[#F5F9FC] hover:text-[#131f2f]"
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-600">{item.badge}</span>
              )}
            </Link>
          ))}
          <div className="mt-4 border-t border-[#E2E8F0] pt-4">
            <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#77838F] transition hover:text-[#131f2f]">
              ← Back to app
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
