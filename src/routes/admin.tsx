import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Users, FileText, DollarSign, Clock, CheckCircle, XCircle,
  Download, Search, RefreshCw, Eye, BarChart3,
  LogOut, Award, TrendingUp, CreditCard, ChevronDown,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // ── Full Excel export with all fields ──
  function exportExcel(data?: Nomination[]) {
    const exportData = data ?? nominations;
    const userMap = new Map(users.map((u) => [u.email, u]));

    // Flattened rows — one row per category entry
    const rows: string[][] = [
      [
        "Nomination ID", "Registrant Name", "Email", "Mobile", "Designation",
        "Company", "Department", "City", "Pincode", "Address",
        "PAN", "GST Number", "Legal Company", "Wants Invoice",
        "Nominee Name", "Nominee Company", "Why Deserves",
        "Sector", "Category", "Total Amount", "Status",
        "Payment Method", "Transaction ID", "Payment Reference",
        "Razorpay Payment ID", "Declaration Agreed", "Submitted On",
      ],
    ];

    for (const n of exportData) {
      const u = userMap.get(n.registrant_email);
      const entries = Array.isArray(n.entries) ? n.entries : [];
      const baseRow = [
        n.id,
        n.registrant_name,
        n.registrant_email,
        u?.mobile ?? "",
        u?.designation ?? "",
        u?.company_name ?? "",
        u?.department ?? "",
        u?.city ?? "",
        u?.pincode ?? "",
        u?.address ?? "",
        u?.pan ?? "",
        u?.gst_number ?? "",
        u?.legal_company_name ?? "",
        u?.wants_invoice ? "Yes" : "No",
      ];

      if (entries.length === 0) {
        rows.push([
          ...baseRow,
          "", "", "", "", "",
          String(n.total_amount),
          n.status,
          n.payment_method ?? "",
          n.transaction_id ?? "",
          n.payment_reference ?? "",
          n.razorpay_payment_id ?? "",
          n.declaration_agreed ? "Yes" : "No",
          new Date(n.created_at).toLocaleDateString("en-IN"),
        ]);
      } else {
        for (const entry of entries as NominationEntry[]) {
          const sectorLabel = SECTORS.find((s) => s.id === entry.sector)?.label ?? entry.sector;
          const catLabel = entry.category_label || getCategoriesForSector(entry.sector, entry.sub_sector ?? undefined).find((c) => c.id === entry.category)?.label || entry.category;
          rows.push([
            ...baseRow,
            entry.nominee_name ?? "",
            entry.company_name ?? "",
            entry.why_deserves ?? "",
            sectorLabel,
            catLabel,
            String(n.total_amount),
            n.status,
            n.payment_method ?? "",
            n.transaction_id ?? "",
            n.payment_reference ?? "",
            n.razorpay_payment_id ?? "",
            n.declaration_agreed ? "Yes" : "No",
            new Date(n.created_at).toLocaleDateString("en-IN"),
          ]);
        }
      }
    }

    // Build CSV with BOM for Excel UTF-8 support
    const bom = "\uFEFF";
    const csv = bom + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BCS-Ratna-Nominations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const TABS = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "nominations", icon: FileText, label: "Nominations" },
    { id: "drafts", icon: Clock, label: "Drafts" },
    { id: "users", icon: Users, label: "Registrants" },
    { id: "payments", icon: DollarSign, label: "Payments" },
  ] as const;

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
            onKeyDown={(e) => { if (e.key === "Enter") { if (pass === ADMIN_PASS) setAuthed(true); else setPassErr("Incorrect password"); } }}
            placeholder="Enter admin password"
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-[#C9A84C] mb-2"
          />
          {passErr && <p className="text-red-400 text-xs mb-3">{passErr}</p>}
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
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-[#C9A84C]/20 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award size={20} className="text-[#C9A84C]" />
          <span className="font-cinzel text-sm text-white hidden sm:block">BCS Ratna Admin</span>
          <span className="font-cinzel text-xs text-white sm:hidden">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="text-white/40 hover:text-[#C9A84C] transition-colors p-1" title="Refresh">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-1.5 text-white/40 hover:text-red-400 text-xs transition-colors">
            <LogOut size={13} /> <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Dropdown */}
      <div className="md:hidden border-b border-[#C9A84C]/10 bg-black/80 px-4 py-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-between w-full text-[#C9A84C] text-sm py-2"
        >
          <span className="flex items-center gap-2">
            {TABS.find((t) => t.id === tab) && React.createElement(TABS.find((t) => t.id === tab)!.icon, { size: 15 })}
            {TABS.find((t) => t.id === tab)?.label}
          </span>
          <ChevronDown size={15} className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
        </button>
        {mobileMenuOpen && (
          <div className="pb-2 flex flex-col gap-1">
            {TABS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setTab(id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all
                  ${tab === id ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:flex flex-col w-56 min-h-[calc(100vh-64px)] bg-black/60 border-r border-[#C9A84C]/10 p-4 gap-1 sticky top-16 self-start">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left
                ${tab === id ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 min-w-0">

          {/* Load Error Banner */}
          {loadError && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              <strong className="font-semibold">Error:</strong> {loadError}
            </div>
          )}

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <h2 className="font-display text-xl md:text-2xl text-white mb-5">Dashboard</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Registrations", value: stats.total_registrations, icon: Users, color: "text-blue-400" },
                  { label: "Nominations", value: stats.total_nominations, icon: FileText, color: "text-purple-400" },
                  { label: "Drafts", value: stats.draft_count, icon: Clock, color: "text-sky-400", action: () => setTab("drafts") },
                  { label: "Revenue", value: `₹${stats.total_revenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "text-green-400" },
                  { label: "Pending Payment", value: stats.pending_payment, icon: Clock, color: "text-yellow-400", action: () => { setTab("nominations"); setStatusFilter("pending_payment"); } },
                  { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-emerald-400" },
                  { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-400" },
                ].map(({ label, value, icon: Icon, color, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    className={`glass-card p-4 text-left rounded-xl ${action ? "hover:bg-white/5 transition-colors cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className={color} />
                      <p className="text-white/50 text-xs truncate">{label}</p>
                    </div>
                    <p className={`font-display text-xl md:text-2xl font-bold ${color}`}>{value}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg text-white flex items-center gap-2">
                  <TrendingUp size={17} className="text-[#C9A84C]" /> Recent Nominations
                </h3>
                <button onClick={() => exportExcel(nominations.slice(0, 10))} className="btn-outline-gold text-xs gap-1.5">
                  <Download size={13} /> Export Excel
                </button>
              </div>
              <AdminTable nominations={nominations.slice(0, 10)} onView={setSelectedNom} onStatusChange={updateStatus} />
            </div>
          )}

          {/* NOMINATIONS */}
          {tab === "nominations" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl md:text-2xl text-white">Nominations</h2>
                <button onClick={() => exportExcel(filtered)} className="btn-outline-gold text-xs gap-1.5">
                  <Download size={13} /> Export Excel
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search name or email…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#C9A84C] w-full sm:w-44">
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="paid">Paid</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#C9A84C] w-full sm:w-44">
                  <option value="all">All Sectors</option>
                  {SECTORS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <p className="text-white/40 text-xs mb-3">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
              <AdminTable nominations={filtered} onView={setSelectedNom} onStatusChange={updateStatus} />
            </div>
          )}

          {/* DRAFTS */}
          {tab === "drafts" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl md:text-2xl text-white">Drafts ({draftFiltered.length})</h2>
                <button onClick={() => exportExcel(draftFiltered)} className="btn-outline-gold text-xs gap-1.5">
                  <Download size={13} /> Export Excel
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search name or email…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#C9A84C] w-full sm:w-44">
                  <option value="all">All Sectors</option>
                  {SECTORS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <AdminTable nominations={draftFiltered} onView={setSelectedNom} onStatusChange={updateStatus} />
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl md:text-2xl text-white">Registrants ({users.length})</h2>
                <button
                  onClick={() => {
                    const bom = "\uFEFF";
                    const rows = [
                      ["Name", "Email", "Mobile", "Designation", "Company", "Department", "City", "Pincode", "Address", "PAN", "GST", "Wants Invoice", "Registered"],
                      ...users.map((u) => [
                        `${u.salutation} ${u.full_name}`, u.email, u.mobile, u.designation, u.company_name,
                        u.department, u.city, u.pincode, u.address, u.pan ?? "", u.gst_number ?? "",
                        u.wants_invoice ? "Yes" : "No",
                        new Date(u.created_at).toLocaleDateString("en-IN"),
                      ]),
                    ];
                    const csv = bom + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url;
                    a.download = `BCS-Registrants-${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click(); URL.revokeObjectURL(url);
                  }}
                  className="btn-outline-gold text-xs gap-1.5"
                >
                  <Download size={13} /> Export Excel
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      {["Name", "Email", "Mobile", "Designation", "Company", "City", "PAN", "GST", "Registered"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-white/45 font-cinzel text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-white text-sm whitespace-nowrap">{u.salutation} {u.full_name}</td>
                        <td className="px-4 py-3 text-white/60 text-xs max-w-[160px] truncate">{u.email}</td>
                        <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">{u.mobile}</td>
                        <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">{u.designation}</td>
                        <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">{u.company_name}</td>
                        <td className="px-4 py-3 text-white/60 text-xs">{u.city}</td>
                        <td className="px-4 py-3 text-white/40 text-xs font-mono">{u.pan ?? "—"}</td>
                        <td className="px-4 py-3 text-white/40 text-xs">
                          {u.wants_invoice ? <span className="text-green-400">Yes</span> : <span className="text-white/25">No</span>}
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
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl md:text-2xl text-white">Payments</h2>
                <button
                  onClick={() => {
                    const paid = nominations.filter((n) => n.payment_method);
                    const bom = "\uFEFF";
                    const rows = [
                      ["Registrant Name", "Email", "Amount", "Method", "Transaction ID", "Razorpay Payment ID", "Status", "Date"],
                      ...paid.map((n) => [
                        n.registrant_name, n.registrant_email,
                        `₹${Number(n.total_amount).toLocaleString("en-IN")}`,
                        n.payment_method ?? "", n.transaction_id ?? "",
                        n.razorpay_payment_id ?? "", n.status,
                        new Date(n.created_at).toLocaleDateString("en-IN"),
                      ]),
                    ];
                    const csv = bom + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url;
                    a.download = `BCS-Payments-${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click(); URL.revokeObjectURL(url);
                  }}
                  className="btn-outline-gold text-xs gap-1.5"
                >
                  <Download size={13} /> Export Excel
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm min-w-[600px]">
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
                        <td className="px-4 py-3">
                          <div className="text-white text-sm font-medium">{n.registrant_name}</div>
                          <div className="text-white/40 text-xs">{n.registrant_email}</div>
                        </td>
                        <td className="px-4 py-3 text-[#C9A84C] font-bold">₹{Number(n.total_amount).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-white/60 text-xs capitalize">{n.payment_method}</td>
                        <td className="px-4 py-3 text-white/60 text-xs font-mono truncate max-w-[140px]">{n.transaction_id ?? "—"}</td>
                        <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                        <td className="px-4 py-3 text-white/45 text-xs whitespace-nowrap">{new Date(n.created_at).toLocaleDateString("en-IN")}</td>
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
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {["Registrant", "Categories", "Amount", "Status", "Date", "Actions"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-white/45 font-cinzel text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nominations.map((n) => (
            <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3">
                <div className="text-white text-sm font-medium">{n.registrant_name}</div>
                <div className="text-white/40 text-xs truncate max-w-[180px]">{n.registrant_email}</div>
              </td>
              <td className="px-4 py-3 text-white/70 text-sm">{Array.isArray(n.entries) ? n.entries.length : 0}</td>
              <td className="px-4 py-3 text-[#C9A84C] font-bold text-sm whitespace-nowrap">₹{Number(n.total_amount).toLocaleString("en-IN")}</td>
              <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
              <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{new Date(n.created_at).toLocaleDateString("en-IN")}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => onView(n)} className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors" title="View">
                    <Eye size={14} />
                  </button>
                  {n.status === "pending_payment" && (
                    <button onClick={() => onStatusChange(n.id, "approved")}
                      className="px-2 py-1 bg-green-500/15 text-green-400 text-xs rounded hover:bg-green-500/25 transition-colors whitespace-nowrap">
                      Approve
                    </button>
                  )}
                  {n.status === "paid" && (
                    <button onClick={() => onStatusChange(n.id, "approved")}
                      className="px-2 py-1 bg-blue-500/15 text-blue-400 text-xs rounded hover:bg-blue-500/25 transition-colors whitespace-nowrap">
                      Mark Approved
                    </button>
                  )}
                  {n.status !== "rejected" && n.status !== "draft" && (
                    <button onClick={() => onStatusChange(n.id, "rejected")}
                      className="px-2 py-1 bg-red-500/15 text-red-400 text-xs rounded hover:bg-red-500/25 transition-colors">
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
    paid:            { label: "Paid",            cls: "bg-blue-500/15 text-blue-400" },
    approved:        { label: "Approved",        cls: "bg-green-500/15 text-green-400" },
    rejected:        { label: "Rejected",        cls: "bg-red-500/15 text-red-400" },
  };
  const c = config[status] ?? { label: status, cls: "bg-white/10 text-white/50" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${c.cls}`}>{c.label}</span>;
}

/* ── Nomination Detail Modal ── */
function NominationModal({
  nom, onClose, onStatusChange,
}: {
  nom: Nomination;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const entries = Array.isArray(nom.entries) ? nom.entries : [];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center p-3 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#C9A84C]/25 rounded-2xl w-full max-w-2xl mt-4 sm:mt-8 mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-white/10 gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg sm:text-xl text-white truncate">{nom.registrant_name}</h3>
            <p className="text-white/45 text-xs mt-0.5 truncate">{nom.registrant_email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={nom.status} />
            <button onClick={onClose} className="text-white/40 hover:text-white text-lg leading-none">✕</button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Categories", value: entries.length, cls: "text-white" },
              { label: "Total", value: `₹${Number(nom.total_amount).toLocaleString("en-IN")}`, cls: "text-[#C9A84C]" },
              { label: "Date", value: new Date(nom.created_at).toLocaleDateString("en-IN"), cls: "text-white/70" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                <p className="text-white/40 text-xs mb-1">{label}</p>
                <p className={`font-bold text-sm sm:text-base ${cls}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Nominee Details */}
          {entries.length > 0 && (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <p className="text-white/50 text-xs font-cinzel mb-3">Nominee Details</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-white/40 text-xs w-24 shrink-0">Nominee</span>
                  <span className="text-white text-sm font-medium">{(entries[0] as NominationEntry).nominee_name || "—"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-white/40 text-xs w-24 shrink-0">Company</span>
                  <span className="text-white text-sm">{(entries[0] as NominationEntry).company_name || "—"}</span>
                </div>
                {(entries[0] as NominationEntry).why_deserves && (
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <span className="text-white/40 text-xs w-24 shrink-0 mt-0.5">Why deserves</span>
                    <span className="text-white/65 text-xs leading-relaxed">{(entries[0] as NominationEntry).why_deserves}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Categories */}
          <div>
            <p className="text-white/50 text-xs font-cinzel mb-3">Selected Categories ({entries.length})</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {entries.map((entry: NominationEntry, i: number) => {
                const cats = getCategoriesForSector(entry.sector, entry.sub_sector ?? undefined);
                const catLabel = (entry.category_label || cats.find((c) => c.id === entry.category)?.label) ?? entry.category;
                const sectorLabel = SECTORS.find((s) => s.id === entry.sector)?.label ?? entry.sector;
                return (
                  <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-white text-xs font-medium truncate">{catLabel}</p>
                      <p className="text-[#C9A84C] text-xs mt-0.5">{sectorLabel}</p>
                    </div>
                    <span className="text-white/40 text-xs shrink-0 ml-2">#{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <p className="text-white/50 text-xs font-cinzel mb-3">Payment Details</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {[
                ["Method", nom.payment_method ?? "—"],
                ["Amount", `₹${Number(nom.total_amount).toLocaleString("en-IN")}`],
                ["Transaction ID", nom.transaction_id ?? "—"],
                ["Razorpay ID", nom.razorpay_payment_id ?? "—"],
                ["Declaration", nom.declaration_agreed ? "✅ Agreed" : "Not agreed"],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="text-white/40">{k}: </span>
                  <span className="text-white capitalize break-all">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {nom.status === "pending_payment" && (
              <button onClick={() => onStatusChange(nom.id, "approved")}
                className="px-4 py-2 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition-colors font-medium">
                ✓ Approve Payment
              </button>
            )}
            {nom.status === "paid" && (
              <button onClick={() => onStatusChange(nom.id, "approved")}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30 transition-colors font-medium">
                ✓ Mark Approved
              </button>
            )}
            {nom.status !== "rejected" && nom.status !== "draft" && (
              <button onClick={() => onStatusChange(nom.id, "rejected")}
                className="px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors font-medium">
                ✕ Reject
              </button>
            )}
            <button onClick={onClose}
              className="px-4 py-2 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10 transition-colors ml-auto">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
