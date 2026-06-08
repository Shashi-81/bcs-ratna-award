import React, { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  Upload, X, Check, AlertCircle, ImageIcon, LayoutGrid, Loader2,
} from "lucide-react";
import { SECTORS, getCategoriesForSector, PRICE_PER_CATEGORY } from "@/lib/nomination-data";

// ─────────────────────────────────────────────────────
// A selected category (no per-category details)
// ─────────────────────────────────────────────────────
export interface SelectedCategory {
  sector: string;
  sub_sector: string;
  category: string;
  category_label: string;
}

// ─────────────────────────────────────────────────────
// Single shared nomination details for ALL categories
// ─────────────────────────────────────────────────────
export interface NominationDetails {
  nominee_name: string;
  company_name: string;
  why_deserves: string;
  photo_file: File | null;
  photo_name: string;
}

export const EMPTY_DETAILS: NominationDetails = {
  nominee_name: "",
  company_name: "",
  why_deserves: "",
  photo_file: null,
  photo_name: "",
};

// ─────────────────────────────────────────────────────
// EntryForm = SelectedCategory + shared NominationDetails
// Used throughout the app for backward compat
// ─────────────────────────────────────────────────────
export interface EntryForm extends SelectedCategory, NominationDetails {
  id: string;
}

interface DetailErrors {
  nominee_name?: string;
  company_name?: string;
  why_deserves?: string;
}

interface Props {
  onNext: (entries: EntryForm[]) => void;
  onBack: () => void;
  initialEntries?: EntryForm[];
  autoSaveStatus?: "idle" | "saving" | "saved" | "error";
  onRetryAutoSave?: () => void;
  editTarget?: { sectorId?: string; entryKey?: string };
}

const inputCls = (hasErr?: boolean) =>
  `w-full bg-[#0d0d0d] border rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none transition-all duration-200
  ${hasErr
    ? "border-[#E27D60] focus:ring-2 focus:ring-[#E27D60]/20"
    : "border-white/10 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
  }`;

function ErrMsg({ msg }: { msg?: string }) {
  return msg ? (
    <p className="flex items-center gap-1.5 text-[#E8A87C] text-xs mt-1.5 font-medium">
      <AlertCircle size={11} className="shrink-0" />{msg}
    </p>
  ) : null;
}

// ─────────────────────────────────────────────────────
export function Step2Categories({
  onNext, onBack, initialEntries,
  autoSaveStatus, onRetryAutoSave, editTarget,
}: Props) {

  // Selected categories list
  const [selected, setSelected] = useState<SelectedCategory[]>(() =>
    initialEntries?.map((e) => ({
      sector: e.sector,
      sub_sector: e.sub_sector,
      category: e.category,
      category_label: e.category_label,
    })) ?? []
  );

  // ONE shared details block
  const [details, setDetails] = useState<NominationDetails>(() => {
    const first = initialEntries?.[0];
    return first ? {
      nominee_name: first.nominee_name,
      company_name: first.company_name,
      why_deserves: first.why_deserves,
      photo_file: first.photo_file,
      photo_name: first.photo_name,
    } : { ...EMPTY_DETAILS };
  });

  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});
  const [openSector, setOpenSector] = useState<string | null>(SECTORS[0].id);
  const [globalError, setGlobalError] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  // ── editTarget: open the right sector accordion
  useEffect(() => {
    if (editTarget?.sectorId) setOpenSector(editTarget.sectorId);
  }, [editTarget]);

  // ── auto-save saved indicator
  useEffect(() => {
    if (autoSaveStatus === "saved") {
      setShowSaved(true);
      const t = setTimeout(() => setShowSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [autoSaveStatus]);

  function isSelected(sectorId: string, catId: string) {
    return selected.some((s) => s.sector === sectorId && s.category === catId);
  }

  function toggleCategory(sectorId: string, subSectorId: string, catId: string, catLabel: string) {
    setGlobalError("");
    if (isSelected(sectorId, catId)) {
      setSelected((p) => p.filter((s) => !(s.sector === sectorId && s.category === catId)));
    } else {
      setSelected((p) => [...p, { sector: sectorId, sub_sector: subSectorId, category: catId, category_label: catLabel }]);
    }
  }

  function setDetail<K extends keyof NominationDetails>(key: K, value: NominationDetails[K]) {
    setDetails((p) => ({ ...p, [key]: value }));
    setDetailErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate(): boolean {
    if (selected.length === 0) {
      setGlobalError("Please select at least one category to proceed.");
      return false;
    }
    const errs: DetailErrors = {};
    if (!details.nominee_name.trim()) errs.nominee_name = "Nominee name is required";
    if (!details.company_name.trim()) errs.company_name = "Company / Brand name is required";
    if (!details.why_deserves.trim()) errs.why_deserves = "Please explain why the nominee deserves to win";
    setDetailErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        document.getElementById("nomination-details-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
      return false;
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // Spread the single details into every selected category entry
    const entries: EntryForm[] = selected.map((s) => ({
      id: crypto.randomUUID(),
      ...s,
      ...details,
    }));
    onNext(entries);
  }

  const total = selected.length * PRICE_PER_CATEGORY;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-white/50 text-sm mb-5 leading-relaxed">
        Open a sector, <span className="text-white/80 font-medium">tick the categories</span> you want to nominate for, then fill in the nominee details once below.
        Each category = <span className="text-[#C9A84C] font-semibold">₹11,800</span> (incl. GST).
      </p>

      {/* ── AUTO-SAVE STATUS BAR ── */}
      {autoSaveStatus && autoSaveStatus !== "idle" && (
        <div className={`flex items-center gap-2 text-xs py-2 px-3 rounded-lg mb-4
          ${autoSaveStatus === "error" ? "bg-amber-500/10 text-amber-400" :
            autoSaveStatus === "saving" ? "bg-amber-500/10 text-amber-400" :
            "bg-green-500/10 text-green-400"}`}
        >
          {autoSaveStatus === "saving" && <Loader2 size={13} className="animate-spin shrink-0" />}
          {autoSaveStatus === "saved" && showSaved && <Check size={13} className="shrink-0" />}
          {autoSaveStatus === "error" && <AlertCircle size={13} className="shrink-0" />}
          <span>
            {autoSaveStatus === "saving" ? "Saving…" :
             autoSaveStatus === "saved" && showSaved ? "Draft saved" :
             autoSaveStatus === "error" ? "Auto-save failed — draft saved locally" : null}
          </span>
          {autoSaveStatus === "error" && (
            <button type="button" onClick={() => onRetryAutoSave?.()} className="ml-auto underline underline-offset-2 hover:text-amber-300">
              Retry
            </button>
          )}
        </div>
      )}

      {/* ── SECTOR ACCORDION + CATEGORY CHECKBOXES ── */}
      <div className="space-y-3 mb-6">
        {SECTORS.map((sector) => {
          const isOpen = openSector === sector.id;
          const selectedCount = selected.filter((s) => s.sector === sector.id).length;

          return (
            <div key={sector.id} className={`rounded-2xl border transition-all duration-200 overflow-hidden
              ${isOpen ? "border-[#C9A84C]/35 bg-[#0e0e0e]" : "border-white/8 bg-[#0a0a0a]"}`}>

              {/* Sector Header */}
              <button type="button"
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenSector(isOpen ? null : sector.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                    ${isOpen ? "bg-[#C9A84C]/20" : "bg-white/5"}`}>
                    <LayoutGrid size={14} className={isOpen ? "text-[#C9A84C]" : "text-white/30"} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${isOpen ? "text-white" : "text-white/60"}`}>{sector.label}</p>
                    {selectedCount > 0 && (
                      <p className="text-[#C9A84C] text-xs mt-0.5 font-medium">
                        {selectedCount} categor{selectedCount === 1 ? "y" : "ies"} selected
                        · ₹{(selectedCount * PRICE_PER_CATEGORY).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center text-black text-xs font-black">
                      {selectedCount}
                    </span>
                  )}
                  {isOpen ? <ChevronUp size={16} className="text-[#C9A84C]" /> : <ChevronDown size={16} className="text-white/30" />}
                </div>
              </button>

              {/* Category Checkboxes */}
              {isOpen && (
                <div className="border-t border-white/6 px-5 pb-5 pt-4">
                  {sector.subSectors ? (
                    sector.subSectors.map((ss) => (
                      <div key={ss.id} className="mb-5">
                        <p className="text-[#C9A84C]/70 text-xs font-cinzel mb-3 pb-2 border-b border-[#C9A84C]/15">{ss.label}</p>
                        <CategoryCheckboxGrid
                          sectorId={sector.id} subSectorId={ss.id}
                          categories={ss.categories}
                          isSelected={isSelected} onToggle={toggleCategory}
                        />
                      </div>
                    ))
                  ) : (
                    <CategoryCheckboxGrid
                      sectorId={sector.id} subSectorId=""
                      categories={sector.categories ?? []}
                      isSelected={isSelected} onToggle={toggleCategory}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── GLOBAL ERROR ── */}
      {globalError && (
        <div className="flex items-center gap-2 p-3 bg-[#E27D60]/10 border border-[#E27D60]/30 rounded-xl mb-4">
          <AlertCircle size={14} className="text-[#E27D60] shrink-0" />
          <p className="text-[#E8A87C] text-sm">{globalError}</p>
        </div>
      )}

      {/* ── LIVE BILL ── */}
      {selected.length > 0 && (
        <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 overflow-hidden mb-6">
          <div className="px-5 py-4">
            <p className="text-[#C9A84C] text-xs font-cinzel mb-3 tracking-widest">Selected Categories</p>
            <div className="space-y-1.5">
              {selected.map((s, i) => (
                <div key={`${s.sector}::${s.category}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[#C9A84C]/60 text-xs shrink-0">{i + 1}.</span>
                    <span className="text-white/65 text-xs leading-relaxed truncate">{s.category_label}</span>
                  </div>
                  <span className="text-white/55 text-xs shrink-0">₹{PRICE_PER_CATEGORY.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#C9A84C]/20 px-5 py-3 flex items-center justify-between bg-[#C9A84C]/5">
            <div>
              <p className="text-white/50 text-xs">{selected.length} categor{selected.length === 1 ? "y" : "ies"} × ₹11,800</p>
              <p className="text-white/30 text-xs mt-0.5">Inclusive of 18% GST</p>
            </div>
            <p className="text-[#C9A84C] font-display text-2xl font-bold">₹{total.toLocaleString("en-IN")}</p>
          </div>
        </div>
      )}

      {/* ── SINGLE NOMINATION DETAILS ── */}
      {selected.length > 0 && (
        <div id="nomination-details-section" className="bg-[#0e0e0e] border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/6">
            <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/15 flex items-center justify-center shrink-0">
              <Check size={14} className="text-[#C9A84C]" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">Nomination Details</h3>
              <p className="text-white/40 text-xs mt-0.5">These details apply to all {selected.length} selected categor{selected.length === 1 ? "y" : "ies"}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-5 gap-y-4">
            {/* Nominee Name */}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Nominee Name <span className="text-[#C9A84C]">*</span>
              </label>
              <input
                type="text"
                value={details.nominee_name}
                onChange={(e) => setDetail("nominee_name", e.target.value)}
                placeholder="Full name of nominee"
                className={inputCls(!!detailErrors.nominee_name)}
              />
              <ErrMsg msg={detailErrors.nominee_name} />
            </div>

            {/* Company / Brand */}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Company / Brand / Channel <span className="text-[#C9A84C]">*</span>
              </label>
              <input
                type="text"
                value={details.company_name}
                onChange={(e) => setDetail("company_name", e.target.value)}
                placeholder="Company or brand name"
                className={inputCls(!!detailErrors.company_name)}
              />
              <ErrMsg msg={detailErrors.company_name} />
            </div>

            {/* Why Deserves */}
            <div className="md:col-span-2">
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Why does the nominee deserve to win? <span className="text-[#C9A84C]">*</span>
              </label>
              <textarea
                rows={4}
                value={details.why_deserves}
                onChange={(e) => setDetail("why_deserves", e.target.value)}
                placeholder="Describe the nominee's achievements, impact and contribution to the industry..."
                className={inputCls(!!detailErrors.why_deserves) + " resize-none"}
              />
              <div className="flex items-center justify-between mt-1">
                <ErrMsg msg={detailErrors.why_deserves} />
                <span className={`text-xs ml-auto ${details.why_deserves.length > 480 ? "text-amber-400" : "text-white/25"}`}>
                  {details.why_deserves.length}/500
                </span>
              </div>
            </div>

            {/* Passport Photo */}
            <div className="md:col-span-2">
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Passport Size Photo
                <span className="text-white/30 normal-case font-normal tracking-normal ml-2">JPG, PNG, HEIC · optional</span>
              </label>
              <PhotoUpload
                file={details.photo_file}
                fileName={details.photo_name}
                onFile={(file, name) => { setDetail("photo_file", file); setDetail("photo_name", name); }}
                onRemove={() => { setDetail("photo_file", null); setDetail("photo_name", ""); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-outline-gold text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <button type="submit" className="btn-gold text-sm">
          Continue to Payment <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────
// Category Checkbox Grid
// ─────────────────────────────────────────────────────
function CategoryCheckboxGrid({
  sectorId, subSectorId, categories, isSelected, onToggle,
}: {
  sectorId: string;
  subSectorId: string;
  categories: { id: string; label: string }[];
  isSelected: (sectorId: string, catId: string) => boolean;
  onToggle: (sectorId: string, subSectorId: string, catId: string, catLabel: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {categories.map((cat) => {
        const checked = isSelected(sectorId, cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onToggle(sectorId, subSectorId, cat.id, cat.label)}
            className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border text-left transition-all duration-150 w-full
              ${checked
                ? "border-[#C9A84C]/60 bg-[#C9A84C]/10 shadow-[0_0_12px_rgba(201,168,76,0.08)]"
                : "border-white/8 bg-[#111] hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5"
              }`}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
              ${checked ? "bg-[#C9A84C] border-[#C9A84C]" : "border-white/20"}`}>
              {checked && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className={`text-xs leading-relaxed transition-colors flex-1 min-w-0 ${checked ? "text-white font-medium" : "text-white/55"}`}>
              {cat.label}
            </span>
            {checked && (
              <span className="shrink-0 text-[#C9A84C] text-xs font-bold self-start mt-0.5 pl-2">₹11,800</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Passport Photo Upload
// ─────────────────────────────────────────────────────
function PhotoUpload({
  file, fileName, onFile, onRemove,
}: {
  file: File | null;
  fileName: string;
  onFile: (file: File, name: string) => void;
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    if (!f.name.toLowerCase().match(/\.(jpg|jpeg|png|heic|heif)$/)) {
      setError("Only JPG, PNG, or HEIC files are allowed");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }
    onFile(f, f.name);
    if (!f.name.toLowerCase().match(/\.(heic|heif)$/)) setPreview(URL.createObjectURL(f));
  }

  return (
    <div>
      {file ? (
        <div className="flex items-center gap-3 p-3.5 bg-[#0d0d0d] border border-[#C9A84C]/25 rounded-xl">
          {preview
            ? <img src={preview} alt="" className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0" />
            : <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0"><ImageIcon size={18} className="text-[#C9A84C]" /></div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{fileName}</p>
            <p className="text-white/35 text-xs mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button type="button" onClick={() => { onRemove(); setPreview(null); setError(""); }}
            className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors shrink-0">
            <X size={11} />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-3 p-3.5 bg-[#0d0d0d] border-2 border-dashed border-white/8 hover:border-[#C9A84C]/35 rounded-xl cursor-pointer transition-all group">
          <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#C9A84C]/8 flex items-center justify-center shrink-0 transition-colors">
            <Upload size={16} className="text-white/25 group-hover:text-[#C9A84C] transition-colors" />
          </div>
          <div>
            <p className="text-white/50 text-xs font-medium">Upload Passport Size Photo</p>
            <p className="text-white/25 text-xs mt-0.5">JPG, PNG, HEIC · Max 5MB</p>
          </div>
          <input type="file" accept=".jpg,.jpeg,.png,.heic,.heif" className="hidden" onChange={handleChange} />
        </label>
      )}
      {error && <p className="flex items-center gap-1.5 text-[#E8A87C] text-xs mt-1.5"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}
