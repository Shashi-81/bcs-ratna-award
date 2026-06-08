import { ImageIcon, Plus, Edit2, User2, Building2 } from "lucide-react";
import type { EntryForm } from "./Step2Categories";
import { SECTORS, PRICE_PER_CATEGORY, calcTotal } from "@/lib/nomination-data";

// Pure helper: group entries by sector
export function groupEntriesBySector(entries: EntryForm[]): Map<string, EntryForm[]> {
  const map = new Map<string, EntryForm[]>();
  for (const entry of entries) {
    const group = map.get(entry.sector);
    if (group) group.push(entry);
    else map.set(entry.sector, [entry]);
  }
  return map;
}

interface ReviewSummaryProps {
  entries: EntryForm[];
  onEditDetails: () => void;   // go back to step 2 to edit nominee details
  onEditSector: (sectorId: string) => void;
  onAddMore: () => void;
}

export function ReviewSummary({ entries, onEditDetails, onEditSector, onAddMore }: ReviewSummaryProps) {
  const grouped = groupEntriesBySector(entries);
  const total = calcTotal(entries.length);
  const first = entries[0];

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Review Your Nomination</h2>
        <p className="text-white/45 text-sm mt-1.5">
          Verify all details before payment. Click Edit to make changes.
        </p>
      </div>

      {/* ── NOMINEE DETAILS (shared across all categories) ── */}
      <div className="bg-[#0e0e0e] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#C9A84C] text-xs font-cinzel tracking-widest">Nominee Details</p>
          <button
            type="button"
            onClick={onEditDetails}
            className="border border-[#C9A84C]/40 text-[#C9A84C] text-xs px-3 py-1.5 rounded-lg hover:border-[#C9A84C] transition-colors flex items-center gap-1.5"
          >
            <Edit2 size={11} /> Edit
          </button>
        </div>

        {first ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User2 size={14} className="text-white/30 shrink-0" />
              <div>
                <p className="text-white/45 text-xs">Nominee</p>
                <p className="text-white text-sm font-medium">{first.nominee_name || <span className="text-white/25 italic">Not filled</span>}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 size={14} className="text-white/30 shrink-0" />
              <div>
                <p className="text-white/45 text-xs">Company / Brand</p>
                <p className="text-white text-sm font-medium">{first.company_name || <span className="text-white/25 italic">Not filled</span>}</p>
              </div>
            </div>
            {first.why_deserves && (
              <div className="pt-1 border-t border-white/5">
                <p className="text-white/40 text-xs mb-1">Why they deserve to win</p>
                <p className="text-white/65 text-xs leading-relaxed line-clamp-3">{first.why_deserves}</p>
              </div>
            )}
            {first.photo_name && (
              <div className="flex items-center gap-1.5 text-white/40 text-xs pt-1 border-t border-white/5">
                <ImageIcon size={12} className="text-[#C9A84C]/60 shrink-0" />
                <span className="truncate">{first.photo_name}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-white/30 text-sm italic">No details entered yet</p>
        )}
      </div>

      {/* ── SELECTED CATEGORIES grouped by sector ── */}
      <div className="bg-[#0e0e0e] border border-white/8 rounded-2xl p-5">
        <p className="text-[#C9A84C] text-xs font-cinzel tracking-widest mb-4">
          Selected Categories ({entries.length})
        </p>
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([sectorId, sectorEntries]) => {
            const sectorLabel = SECTORS.find((s) => s.id === sectorId)?.label ?? sectorId;
            return (
              <div key={sectorId}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/55 text-xs font-semibold uppercase tracking-wider">{sectorLabel}</p>
                  <button
                    type="button"
                    onClick={() => onEditSector(sectorId)}
                    className="text-[#C9A84C]/60 hover:text-[#C9A84C] text-xs transition-colors"
                  >
                    Edit sector
                  </button>
                </div>
                <div className="space-y-1.5">
                  {sectorEntries.map((entry) => (
                    <div key={`${entry.sector}::${entry.category}`}
                      className="flex items-center justify-between gap-3 px-3 py-2 bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-lg">
                      <span className="text-white/70 text-xs leading-relaxed">{entry.category_label}</span>
                      <span className="text-[#C9A84C] text-xs font-semibold shrink-0">₹{PRICE_PER_CATEGORY.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TOTAL + ADD MORE ── */}
      <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/65 text-sm font-medium">{entries.length} categor{entries.length === 1 ? "y" : "ies"} selected</p>
            <p className="text-white/35 text-xs mt-0.5">All prices inclusive of 18% GST</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs mb-0.5">{entries.length} × ₹{PRICE_PER_CATEGORY.toLocaleString("en-IN")}</p>
            <p className="text-[#C9A84C] font-display text-2xl font-bold">₹{total.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="border-t border-[#C9A84C]/20 px-5 py-3">
          <button type="button" onClick={onAddMore}
            className="btn-outline-gold text-sm flex items-center gap-2">
            <Plus size={15} /> Add More Categories
          </button>
        </div>
      </div>
    </div>
  );
}
