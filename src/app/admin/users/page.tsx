"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string | null;
  plan: string;
  sub_status: string;
  suspended: boolean;
  today_calls: number;
}

const PLAN_BADGE: Record<string, string> = {
  free:       "bg-[#F5F7FA] text-[#77838F] border-[#E2E8F0]",
  pro:        "bg-emerald-50 text-emerald-700 border-emerald-200",
  enterprise: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [q,       setQ]       = useState("");
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);

  async function load(query: string, pg: number) {
    setLoading(true);
    const res  = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}&page=${pg}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  useEffect(() => { load(q, page); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(q, 1);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#131f2f]">Users</h1>
          <p className="mt-1 text-sm text-[#77838F]">{total} total users</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email…"
            className="rounded-xl border border-[#dcdce3] px-3 py-2 text-sm outline-none focus:border-[#006EDC] focus:ring-1 focus:ring-[#006EDC]/20"
          />
          <button type="submit" className="rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060c0]">
            Search
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#77838F]">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#77838F]">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#77838F]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#77838F]">Calls today</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#77838F]">Joined</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#77838F]"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-[#77838F]">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-[#77838F]">No users found.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-[#F5F7FA] hover:bg-[#FAFBFC]">
                <td className="px-4 py-3 font-medium text-[#131f2f]">{u.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${PLAN_BADGE[u.plan] ?? PLAN_BADGE.free}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.suspended ? (
                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">Suspended</span>
                  ) : (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">Active</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#3B4959]">{u.today_calls}</td>
                <td className="px-4 py-3 text-[#77838F]">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${u.id}`} className="text-[11px] font-medium text-[#006EDC] hover:underline">
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {total > 20 && (
          <div className="flex items-center justify-between border-t border-[#E2E8F0] px-4 py-3">
            <span className="text-xs text-[#77838F]">Page {page} of {Math.ceil(total / 20)}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => { setPage(page - 1); load(q, page - 1); }}
                className="rounded-lg border border-[#dcdce3] px-3 py-1.5 text-xs disabled:opacity-40">← Prev</button>
              <button disabled={page >= Math.ceil(total / 20)} onClick={() => { setPage(page + 1); load(q, page + 1); }}
                className="rounded-lg border border-[#dcdce3] px-3 py-1.5 text-xs disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
