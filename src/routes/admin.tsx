import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Users, FileText, DollarSign, Clock, CheckCircle, XCircle,
  Download, Search, RefreshCw, Eye, BarChart3,
  LogOut, Award, TrendingUp, CreditCard,
} from "lucide-react";
import type { Nomination, User, NominationEntry } from "@/lib/supabase";
import { SECTORS, getCategoriesForSector } from "@/lib/nomination-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — BCS Ratna Award 2026" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "dashboard" | "nominations" | "drafts" | "users" | "payments";

interface Stats {
  total_registrations: number;
  total_nominations: number;
  total_revenue: number;
  pending_payment: number;
  approved: number;
  rejected: number;
  draft_count: number;
}

const ADMIN_PASS = "BCSRatna2026@Admin";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ total_registrations: 0, total_nominations: 0, total_revenue: 0, pending_payment: 0, approved: 0, rejected: 0, draft_count: 0 });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [selectedNom, setSelectedNom] = useState<Nomination | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { supabase } = await import("@/lib/supabase");
      const [{ data: noms, error: nomsError }, { data: usrs, error: usrsError }] = await Promise.all([
        supabase.from("nominations").select("*").order("created_at", { ascending: false }),
        supabase.from("users").select("*").order("created_at", { ascending: false }),
      ]);
      if (nomsError || usrsError) {
        throw new Error(nomsError?.message || usrsError?.message || "Failed to fetch admin data");
      }
      const n = (noms as Nomination[]) ?? [];
      const u = (usrs as User[]) ?? [];
      setNominations(n);
      setUsers(u);
      setStats({
        total_registrations: u.length,
        total_nominations: n.length,
        total_revenue: n.filter((x) => x.status === "paid" || x.status === "approved").reduce((s, x) => s + Number(x.total_amount), 0),
        pending_payment: n.filter((x) => x.status === "pending_payment").length,
        approved: n.filter((x) => x.status === "approved").length,
        rejected: n.filter((x) => x.status === "rejected").length,
        draft_count: n.filter((x) => x.status === "draft").length,
      });
    } catch (error) {
      console.error(error);
      setLoadError(error instanceof Error ? error.message : "Unable to load admin data. Check your Supabase connection.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) loadData(); }, [authed, loadData]);

  async function updateStatus(id: string, status: string) {
    const { supabase } = await import("@/lib/supabase");
    await supabase.from("nominations").update({ status }).eq("id", id);
    loadData();
    setSelectedNom(null);
  }

  function exportCSV() {
    const rows = [
      ["ID", "Registrant Name", "Email", "Mobile", "Company", "City", "Categories", "Nominee", "Nominee Company", "Amount", "Status", "Payment ID", "Date"],
      ...nominations.map((n) => {
        const firstEntry = Array.isArray(n.entries) && n.entries.length > 0 ? n.entries[0] as Record<string, unknown> : null;
        return [
          n.id,
          n.registrant_name,
          n.registrant_email,
          "", // mobile not in nominations — in users table
          "",
          "",
          Array.isArray(n.entries) ? n.entries.length : 0,
          firstEntry?.nominee_name ?? "",
          firstEntry?.company_name ?? "",
          n.total_amount,
          n.status,
          n.transaction_id ?? "",
          new Date(n.created_at).toLocaleDateString("en-IN"),
        ];
      }),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `bcs-nominations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const filtered = nominations.filter((n) => {
    const matchSearch =
      !searchTerm ||
      n.registrant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.registrant_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || n.status === statusFilter;
    const matchSector =
      sectorFilter === "all" ||
      (Array.isArray(n.entries) && n.entries.some((e: { sector?: string }) => e.sector === sectorFilter));
    return matchSearch && matchStatus && matchSector;
  });

  const draftFiltered = nominations
    .filter((n) => n.status === "draft")
    .filter((n) => {
      const matchSearch =
        !searchTerm ||
        n.registrant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.registrant_email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSector =
        sectorFilter === "all" ||
        (Array.isArray(n.entries) && n.entries.some((e: { sector?: string }) => e.sector === sectorFilter));
      return matchSearch && matchSector;
    });

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass-card p-8 w-full max-w-sm text-center">
          <Award size={36} className="text-[#C9A84C] mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-white/45 text-sm mb-6">BCS Ratna Award 2026</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setPassErr(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") { if (pass === ADMIN_PASS) setAuthed(true); else setPassErr("Incorrect password"); }}}
            placeholder="Enter admin password"
            className={`input-gold mb-2 ${passErr ? "has-error" : ""}`}
          />
          {passErr && <p className="field-error mb-3">{passErr}</p>}
          <button
            className="btn-gold w-full mt-3"
            onClick={() => { if (pass === ADMIN_PASS) setAuthed(true); else setPassErr("Incorrect password"); }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-[#C9A84C]/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award size={22} className="text-[#C9A84C]" />
          <span className="font-cinzel text-sm text-white">BCS Ratna Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="text-white/40 hover:text-[#C9A84C] transition-colors">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-1.5 text-white/40 hover:text-red-400 text-xs transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 min-h-[calc(100vh-64px)] bg-black/60 border-r border-[#C9A84C]/10 p-4 gap-1 sticky top-16 self-start">
          {([
            { id: "dashboard", icon: BarChart3, label: "Dashboard" },
            { id: "nominations", icon: FileText, label: "Nominations" },
            { id: "drafts", icon: Clock, label: "Drafts" },
            { id: "users", icon: Users, label: "Registrants" },
            { id: "payments", icon: DollarSign, label: "Payments" },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left
                ${tab === id ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-full overflow-x-hidden">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <h2 className="font-display text-2xl text-white mb-6">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Registrations", value: stats.total_registrations, icon: Users, color: "text-blue-400" },
                  { label: "Nominations", value: stats.total_nominations, icon: FileText, color: "text-purple-400" },
                  { label: "Drafts", value: stats.draft_count, icon: Clock, color: "text-sky-400", action: () => { setTab("drafts"); setStatusFilter("all"); } },
                  { label: "Revenue", value: `₹${stats.total_revenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "text-green-400" },
                  { label: "Pending Payment", value: stats.pending_payment, icon: Clock, color: "text-yellow-400" },
                  { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-emerald-400" },
                  { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-400" },
                ].map(({ label, value, icon: Icon, color, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    className={`glass-card p-5 text-left ${action ? "hover:bg-white/5 transition-colors" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={18} className={color} />
                      <p className="text-white/50 text-xs">{label}</p>
                    </div>
                    <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
                  </button>
                ))}
              </div>

              {/* Recent */}
              <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#C9A84C]" /> Recent Nominations
              </h3>
              <AdminTable nominations={nominations.slice(0, 10)} onView={setSelectedNom} onStatusChange={updateStatus} />
            </div>
          )}

          {/* NOMINATIONS */}
          {tab === "nominations" && (
            <div>
              {loadError && (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          <strong className="font-semibold">Admin data load failed:</strong> {loadError}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-gold pl-9 text-sm"
                  />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-gold text-sm w-full sm:w-44">
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="paid">Paid</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="input-gold text-sm w-full sm:w-44">
                  <option value="all">All Sectors</option>
                  {SECTORS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button onClick={exportCSV} className="btn-outline-gold text-xs gap-2 whitespace-nowrap">
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <div className="mb-3 flex flex-col gap-2">
                <p className="text-white/40 text-xs">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
                {statusFilter === "draft" && (
                  <p className="text-sky-200 text-xs">Showing draft nominations only. Use the status filter to view all statuses.</p>
                )}
              </div>
              <AdminTable nominations={filtered} onView={setSelectedNom} onStatusChange={updateStatus} />
            </div>
          )}

          {/* DRAFTS */}
          {tab === "drafts" && (
            <div>
              {loadError && (
                <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                  <strong className="font-semibold">Admin data load failed:</strong> {loadError}
                </div>
              )}
              <h2 className="font-display text-2xl text-white mb-6">Draft Nominations ({draftFiltered.length})</h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-gold pl-9 text-sm"
                  />
                </div>
                <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="input-gold text-sm w-full sm:w-44">
                  <option value="all">All Sectors</option>
                  {SECTORS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button onClick={exportCSV} className="btn-outline-gold text-xs gap-2 whitespace-nowrap">
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <p className="text-sky-200 text-xs mb-3">Showing drafts only. Use the search and sector filters to narrow results.</p>
              <AdminTable nominations={draftFiltered} onView={setSelectedNom} onStatusChange={updateStatus} />
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div>
              <h2 className="font-display text-2xl text-white mb-6">Registrants ({users.length})</h2>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      {["Name", "Email", "Designation", "Company", "Mobile", "City", "PAN", "GST", "Registered"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-white/45 font-cinzel text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-white text-sm whitespace-nowrap">{u.salutation} {u.full_name}</td>
                        <td className="px-4 py-3 text-white/60 text-xs">{u.email}</td>
                        <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">{u.designation}</td>
                        <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">{u.company_name}</td>
                        <td className="px-4 py-3 text-white/60 text-xs">{u.mobile}</td>
                        <td className="px-4 py-3 text-white/60 text-xs">{u.city}</td>
                        <td className="px-4 py-3 text-white/40 text-xs font-mono">{u.pan ?? "—"}</td>
                        <td className="px-4 py-3 text-white/40 text-xs">
                          {u.wants_invoice ? (
                            <span className="text-green-400 text-xs">Yes</span>
                          ) : (
                            <span className="text-white/25 text-xs">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white/45 text-xs whitespace-nowrap">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={9} className="px-4 py-8 text-center text-white/30 text-sm">No registrants yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {tab === "payments" && (
            <div>
              <h2 className="font-display text-2xl text-white mb-6">Payments</h2>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      {["Registrant", "Amount", "Method", "Transaction ID", "Status", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-white/45 font-cinzel text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nominations.filter((n) => n.payment_method).map((n) => (
                      <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-white text-sm">
                          <div>{n.registrant_name}</div>
                          <div className="text-white/40 text-xs">{n.registrant_email}</div>
                        </td>
                        <td className="px-4 py-3 text-[#C9A84C] font-bold">₹{Number(n.total_amount).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-white/60 text-xs capitalize">{n.payment_method}</td>
                        <td className="px-4 py-3 text-white/60 text-xs font-mono">{n.transaction_id ?? "—"}</td>
                        <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                        <td className="px-4 py-3 text-white/45 text-xs">{new Date(n.created_at).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                    {nominations.filter((n) => n.payment_method).length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">No payments yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Nomination Detail Modal */}
      {selectedNom && (
        <NominationModal nom={selectedNom} onClose={() => setSelectedNom(null)} onStatusChange={updateStatus} />
      )}
    </div>
  );
}

/* ── Admin Table ── */
function AdminTable({
  nominations,
  onView,
  onStatusChange,
}: {
  nominations: Nomination[];
  onView: (n: Nomination) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {["Registrant", "Categories", "Amount", "Status", "Date", "Action"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-white/45 font-cinzel text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nominations.map((n) => (
            <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3">
                <div className="text-white text-sm font-medium">{n.registrant_name}</div>
                <div className="text-white/40 text-xs">{n.registrant_email}</div>
              </td>
              <td className="px-4 py-3 text-white/70 text-sm">
                {Array.isArray(n.entries) ? n.entries.length : 0}
              </td>
              <td className="px-4 py-3 text-[#C9A84C] font-bold text-sm">
                ₹{Number(n.total_amount).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
              <td className="px-4 py-3 text-white/40 text-xs">
                {new Date(n.created_at).toLocaleDateString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(n)}
                    className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </button>
                  {n.status === "pending_payment" && (
                    <button
                      onClick={() => onStatusChange(n.id, "approved")}
                      className="px-2 py-1 bg-green-500/15 text-green-400 text-xs rounded hover:bg-green-500/25 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {n.status !== "rejected" && n.status !== "draft" && (
                    <button
                      onClick={() => onStatusChange(n.id, "rejected")}
                      className="px-2 py-1 bg-red-500/15 text-red-400 text-xs rounded hover:bg-red-500/25 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {nominations.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">No nominations found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    draft:           { label: "Draft",           cls: "bg-white/10 text-white/50" },
    pending_payment: { label: "Pending Payment", cls: "bg-yellow-500/15 text-yellow-400" },
    paid:            { label: "Paid",             cls: "bg-blue-500/15 text-blue-400" },
    approved:        { label: "Approved",         cls: "bg-green-500/15 text-green-400" },
    rejected:        { label: "Rejected",         cls: "bg-red-500/15 text-red-400" },
  };
  const c = config[status] ?? { label: status, cls: "bg-white/10 text-white/50" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.cls}`}>{c.label}</span>
  );
}

/* ── Nomination Detail Modal ── */
function NominationModal({
  nom,
  onClose,
  onStatusChange,
}: {
  nom: Nomination;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const entries = Array.isArray(nom.entries) ? nom.entries : [];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#C9A84C]/25 rounded-2xl w-full max-w-2xl mt-8 mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="font-display text-xl text-white">{nom.registrant_name}</h3>
            <p className="text-white/45 text-xs mt-0.5">{nom.registrant_email}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={nom.status} />
            <button onClick={onClose} className="text-white/40 hover:text-white text-lg">✕</button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.03] rounded-xl p-3 text-center">
              <p className="text-white/40 text-xs">Categories</p>
              <p className="text-white font-bold text-lg">{entries.length}</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 text-center">
              <p className="text-white/40 text-xs">Total</p>
              <p className="text-[#C9A84C] font-bold text-lg">₹{Number(nom.total_amount).toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 text-center">
              <p className="text-white/40 text-xs">Status</p>
              <StatusBadge status={nom.status} />
            </div>
          </div>

          {/* Nominee Details (shared — from first entry) */}
          {entries.length > 0 && (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <p className="text-white/50 text-xs font-cinzel mb-3">Nominee Details</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs w-28 shrink-0">Nominee</span>
                  <span className="text-white text-sm font-medium">{(entries[0] as NominationEntry).nominee_name || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs w-28 shrink-0">Company</span>
                  <span className="text-white text-sm">{(entries[0] as NominationEntry).company_name || "—"}</span>
                </div>
                {(entries[0] as NominationEntry).why_deserves && (
                  <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                    <span className="text-white/40 text-xs w-28 shrink-0 mt-0.5">Why deserves</span>
                    <span className="text-white/65 text-xs leading-relaxed line-clamp-3">{(entries[0] as NominationEntry).why_deserves}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Categories */}
          <div>
            <p className="text-white/50 text-xs font-cinzel mb-3">Selected Categories ({entries.length})</p>
            <div className="space-y-2">
              {entries.map((entry: NominationEntry, i: number) => {
                const cats = getCategoriesForSector(entry.sector, entry.sub_sector ?? undefined);
                const catLabel = (entry.category_label || cats.find((c) => c.id === entry.category)?.label) ?? entry.category;
                const sectorLabel = SECTORS.find((s) => s.id === entry.sector)?.label ?? entry.sector;
                return (
                  <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2.5">
                    <div>
                      <p className="text-white text-xs font-medium">{catLabel}</p>
                      <p className="text-[#C9A84C] text-xs mt-0.5">{sectorLabel}</p>
                    </div>
                    <span className="text-white/40 text-xs">#{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <p className="text-white/50 text-xs font-cinzel mb-3">Payment Details</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-white/40">Method: </span>
                <span className="text-white capitalize">{nom.payment_method ?? "—"}</span>
              </div>
              <div>
                <span className="text-white/40">Amount: </span>
                <span className="text-[#C9A84C] font-bold">₹{Number(nom.total_amount).toLocaleString("en-IN")}</span>
              </div>
              {nom.transaction_id && (
                <div className="col-span-2">
                  <span className="text-white/40">Razorpay ID: </span>
                  <span className="text-white font-mono text-xs">{nom.transaction_id}</span>
                </div>
              )}
              {nom.payment_reference && (
                <div className="col-span-2">
                  <span className="text-white/40">Order ID: </span>
                  <span className="text-white font-mono text-xs">{nom.payment_reference}</span>
                </div>
              )}
              <div>
                <span className="text-white/40">Declaration: </span>
                <span className={nom.declaration_agreed ? "text-green-400" : "text-red-400"}>
                  {nom.declaration_agreed ? "Agreed" : "Not agreed"}
                </span>
              </div>
              <div>
                <span className="text-white/40">Date: </span>
                <span className="text-white">{new Date(nom.created_at).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {(nom.status === "pending_payment" || nom.status === "paid") && (
            <div className="flex gap-3">
              {nom.status !== "approved" && (
                <button
                  onClick={() => onStatusChange(nom.id, "approved")}
                  className="flex-1 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-semibold hover:bg-green-500/30 transition-colors"
                >
                  ✓ Approve
                </button>
              )}
              <button
                onClick={() => onStatusChange(nom.id, "rejected")}
                className="flex-1 py-2.5 bg-red-500/15 text-red-400 border border-red-500/25 rounded-xl text-sm font-semibold hover:bg-red-500/25 transition-colors"
              >
                ✕ Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
