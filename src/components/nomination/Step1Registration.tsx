import React, { useState, useRef } from "react";
import { ArrowRight, AlertCircle, User, Building2, Phone, Receipt } from "lucide-react";
import { SALUTATIONS } from "@/lib/nomination-data";

export interface RegistrationData {
  salutation: string;
  full_name: string;
  designation: string;
  company_name: string;
  department: string;
  email: string;
  mobile: string;
  city: string;
  pincode: string;
  pan: string;
  address: string;
  wants_invoice: boolean;
  gst_number: string;
  legal_company_name: string;
  billing_address: string;
  newsletter: boolean;
}

const EMPTY: RegistrationData = {
  salutation: "",
  full_name: "",
  designation: "",
  company_name: "",
  department: "",
  email: "",
  mobile: "",
  city: "",
  pincode: "",
  pan: "",
  address: "",
  wants_invoice: false,
  gst_number: "",
  legal_company_name: "",
  billing_address: "",
  newsletter: false,
};

type FieldKey = keyof RegistrationData;
type Errors = Partial<Record<FieldKey, string>>;

interface Props {
  onNext: (data: RegistrationData) => void;
  initialData?: Partial<RegistrationData>;
}

function validateField(field: FieldKey, form: RegistrationData): string {
  const v = form[field];
  const s = typeof v === "string" ? v.trim() : "";
  switch (field) {
    case "salutation":   return !s ? "Please select a salutation" : "";
    case "full_name":    return !s ? "Full name is required" : "";
    case "designation":  return !s ? "Designation is required" : "";
    case "company_name": return !s ? "Company name is required" : "";
    case "department":   return !s ? "Department is required" : "";
    case "email":
      if (!s) return "Email address is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "Enter a valid email address";
      return "";
    case "mobile": {
      const digits = s.replace(/\D/g, "");
      if (!digits) return "Mobile number is required";
      if (digits.length !== 10) return "Enter a valid 10-digit mobile number";
      if (/^[0-5]/.test(digits)) return "Mobile number must start with 6, 7, 8 or 9";
      return "";
    }
    case "city":    return !s ? "City is required" : "";
    case "pincode": {
      const digits = s.replace(/\D/g, "");
      if (!digits) return "Pincode is required";
      if (digits.length !== 6) return "Enter a valid 6-digit pincode";
      return "";
    }
    case "address": return !s ? "Company address is required" : "";
    case "gst_number":
      return form.wants_invoice && !s ? "GST number is required" : "";
    case "legal_company_name":
      return form.wants_invoice && !s ? "Legal company name is required" : "";
    case "billing_address":
      return form.wants_invoice && !s ? "Billing address is required" : "";
    default: return "";
  }
}

const REQUIRED_FIELDS: FieldKey[] = [
  "salutation", "full_name", "designation", "company_name",
  "department", "email", "mobile", "city", "pincode", "address",
];

export function Step1Registration({ onNext, initialData }: Props) {
  const [form, setForm] = useState<RegistrationData>({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const wrapperRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});

  function setField(field: FieldKey, value: string | boolean) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      setErrors((p) => ({ ...p, [field]: validateField(field, updated) }));
    }
  }

  function blurField(field: FieldKey) {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors((p) => ({ ...p, [field]: validateField(field, form) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fields = form.wants_invoice
      ? [...REQUIRED_FIELDS, "gst_number" as FieldKey, "legal_company_name" as FieldKey, "billing_address" as FieldKey]
      : REQUIRED_FIELDS;

    const newErrors: Errors = {};
    const allTouched: Partial<Record<FieldKey, boolean>> = {};
    fields.forEach((f) => {
      allTouched[f] = true;
      const err = validateField(f, form);
      if (err) newErrors[f] = err;
    });
    setTouched(allTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error field
      const ORDER: FieldKey[] = [
        "salutation", "full_name", "designation", "company_name",
        "department", "email", "mobile", "city", "pincode", "address",
        "gst_number", "legal_company_name", "billing_address",
      ];
      setTimeout(() => {
        for (const f of ORDER) {
          if (newErrors[f]) {
            const el = wrapperRefs.current[f];
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.querySelector<HTMLElement>("input,select,textarea")?.focus();
            }
            break;
          }
        }
      }, 40);
      return;
    }
    onNext(form);
  }

  // Helper: ref setter
  function r(field: FieldKey) {
    return (el: HTMLDivElement | null) => { wrapperRefs.current[field] = el; };
  }

  // Helper: field error display
  function ErrMsg({ field }: { field: FieldKey }) {
    return errors[field] ? (
      <p className="flex items-center gap-1.5 text-[#E8A87C] text-xs mt-1.5 font-medium">
        <AlertCircle size={11} className="shrink-0" />{errors[field]}
      </p>
    ) : null;
  }

  const inputCls = (field: FieldKey) =>
    `w-full bg-[#111] border rounded-lg px-4 py-3 text-white text-sm placeholder-white/30 outline-none transition-all duration-200
    ${errors[field]
      ? "border-[#E27D60] focus:border-[#E27D60] focus:ring-2 focus:ring-[#E27D60]/20"
      : "border-white/10 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
    }`;

  const sectionCls = "bg-[#0e0e0e] border border-white/8 rounded-2xl p-6 md:p-8";
  const sectionHead = (icon: React.ReactNode, title: string) => (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/6">
      <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/15 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="font-semibold text-white text-sm tracking-wide">{title}</h3>
    </div>
  );
  const labelCls = "block text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── PERSONAL DETAILS ── */}
      <div className={sectionCls}>
        {sectionHead(<User size={15} className="text-[#C9A84C]" />, "Personal Details")}
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">

          {/* Salutation + Full Name on same row */}
          <div ref={r("salutation")}>
            <label className={labelCls}>Salutation <span className="text-[#C9A84C]">*</span></label>
            <select
              value={form.salutation}
              onChange={(e) => setField("salutation", e.target.value)}
              onBlur={() => blurField("salutation")}
              className={inputCls("salutation") + " appearance-none cursor-pointer"}
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23C9A84C' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "2.5rem" }}
            >
              <option value="">Select salutation</option>
              {SALUTATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ErrMsg field="salutation" />
          </div>

          <div ref={r("full_name")}>
            <label className={labelCls}>Full Name <span className="text-[#C9A84C]">*</span></label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setField("full_name", e.target.value)}
              onBlur={() => blurField("full_name")}
              placeholder="Enter your full name"
              className={inputCls("full_name")}
            />
            <ErrMsg field="full_name" />
          </div>

          <div ref={r("designation")}>
            <label className={labelCls}>Designation <span className="text-[#C9A84C]">*</span></label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => setField("designation", e.target.value)}
              onBlur={() => blurField("designation")}
              placeholder="e.g. CEO, Director, Manager"
              className={inputCls("designation")}
            />
            <ErrMsg field="designation" />
          </div>

          <div ref={r("department")}>
            <label className={labelCls}>Department <span className="text-[#C9A84C]">*</span></label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setField("department", e.target.value)}
              onBlur={() => blurField("department")}
              placeholder="e.g. Marketing, Content, Tech"
              className={inputCls("department")}
            />
            <ErrMsg field="department" />
          </div>

        </div>
      </div>

      {/* ── COMPANY DETAILS ── */}
      <div className={sectionCls}>
        {sectionHead(<Building2 size={15} className="text-[#C9A84C]" />, "Company Details")}
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">

          <div ref={r("company_name")}>
            <label className={labelCls}>Company Name <span className="text-[#C9A84C]">*</span></label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => setField("company_name", e.target.value)}
              onBlur={() => blurField("company_name")}
              placeholder="Organisation / Company name"
              className={inputCls("company_name")}
            />
            <ErrMsg field="company_name" />
          </div>

          <div ref={r("email")}>
            <label className={labelCls}>Email ID <span className="text-[#C9A84C]">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => blurField("email")}
              placeholder="you@company.com"
              className={inputCls("email")}
            />
            <ErrMsg field="email" />
          </div>

          <div ref={r("address")} className="md:col-span-2">
            <label className={labelCls}>Company's Full Address <span className="text-[#C9A84C]">*</span></label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              onBlur={() => blurField("address")}
              placeholder="Full office / registered address"
              className={inputCls("address") + " resize-none"}
            />
            <ErrMsg field="address" />
          </div>

        </div>
      </div>

      {/* ── CONTACT DETAILS ── */}
      <div className={sectionCls}>
        {sectionHead(<Phone size={15} className="text-[#C9A84C]" />, "Contact Details")}
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">

          {/* Mobile */}
          <div ref={r("mobile")}>
            <label className={labelCls}>Mobile Number <span className="text-[#C9A84C]">*</span></label>
            <div className={`flex rounded-lg overflow-hidden border transition-all duration-200
              ${errors.mobile
                ? "border-[#E27D60] focus-within:ring-2 focus-within:ring-[#E27D60]/20"
                : "border-white/10 focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/15"
              }`}
            >
              <span className="flex items-center justify-center px-4 bg-[#1a1a1a] border-r border-white/10 text-[#C9A84C] text-sm font-bold shrink-0 select-none">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={form.mobile}
                onChange={(e) => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                onBlur={() => blurField("mobile")}
                placeholder="Enter 10-digit mobile number"
                className="flex-1 bg-[#111] px-4 py-3 text-white text-sm placeholder-white/30 outline-none"
              />
            </div>
            <ErrMsg field="mobile" />
          </div>

          {/* City */}
          <div ref={r("city")}>
            <label className={labelCls}>City <span className="text-[#C9A84C]">*</span></label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              onBlur={() => blurField("city")}
              placeholder="Your city"
              className={inputCls("city")}
            />
            <ErrMsg field="city" />
          </div>

          {/* Pincode */}
          <div ref={r("pincode")}>
            <label className={labelCls}>Pincode <span className="text-[#C9A84C]">*</span></label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              onBlur={() => blurField("pincode")}
              placeholder="6-digit pincode"
              className={inputCls("pincode")}
            />
            <ErrMsg field="pincode" />
          </div>

          {/* PAN Card */}
          <div>
            <label className={labelCls}>PAN Card Number</label>
            <input
              type="text"
              value={form.pan}
              onChange={(e) => setField("pan", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
              placeholder="e.g. ABCDE1234F (optional)"
              maxLength={10}
              className={inputCls("pan")}
            />
          </div>

        </div>
      </div>

      {/* ── INVOICE DETAILS ── */}
      <div className={sectionCls}>
        {sectionHead(<Receipt size={15} className="text-[#C9A84C]" />, "Invoice Details")}
        <div>
          <label className={labelCls}>Do you want invoice on company name? <span className="text-[#C9A84C]">*</span></label>
          <div className="flex gap-4 mt-2">
            {["Yes", "No"].map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-all
                  ${form.wants_invoice === (opt === "Yes")
                    ? "border-[#C9A84C] bg-[#C9A84C]/10 text-white"
                    : "border-white/10 bg-[#111] text-white/50 hover:border-white/25"
                  }`}
              >
                <input
                  type="radio"
                  name="wants_invoice"
                  checked={form.wants_invoice === (opt === "Yes")}
                  onChange={() => setField("wants_invoice", opt === "Yes")}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                  ${form.wants_invoice === (opt === "Yes") ? "border-[#C9A84C]" : "border-white/20"}`}
                >
                  {form.wants_invoice === (opt === "Yes") && (
                    <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                  )}
                </span>
                <span className="text-sm font-medium">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {form.wants_invoice && (
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5 mt-6 pt-5 border-t border-white/6">
            <div ref={r("gst_number")}>
              <label className={labelCls}>GST Number <span className="text-[#C9A84C]">*</span></label>
              <input
                type="text"
                value={form.gst_number}
                onChange={(e) => setField("gst_number", e.target.value.toUpperCase().slice(0, 15))}
                onBlur={() => blurField("gst_number")}
                placeholder="15-character GSTIN"
                maxLength={15}
                className={inputCls("gst_number")}
              />
              <ErrMsg field="gst_number" />
            </div>
            <div ref={r("legal_company_name")}>
              <label className={labelCls}>Legal Company Name <span className="text-[#C9A84C]">*</span></label>
              <input
                type="text"
                value={form.legal_company_name}
                onChange={(e) => setField("legal_company_name", e.target.value)}
                onBlur={() => blurField("legal_company_name")}
                placeholder="As per GST registration"
                className={inputCls("legal_company_name")}
              />
              <ErrMsg field="legal_company_name" />
            </div>
            <div ref={r("billing_address")} className="md:col-span-2">
              <label className={labelCls}>Billing Address <span className="text-[#C9A84C]">*</span></label>
              <textarea
                rows={2}
                value={form.billing_address}
                onChange={(e) => setField("billing_address", e.target.value)}
                onBlur={() => blurField("billing_address")}
                placeholder="Billing address for invoice"
                className={inputCls("billing_address") + " resize-none"}
              />
              <ErrMsg field="billing_address" />
            </div>
          </div>
        )}
      </div>

      {/* ── NEWSLETTER ── */}
      <div className={sectionCls}>
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
            ${form.newsletter ? "bg-[#C9A84C] border-[#C9A84C]" : "border-white/20 group-hover:border-[#C9A84C]/50"}`}
          >
            {form.newsletter && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={form.newsletter}
            onChange={(e) => setField("newsletter", e.target.checked)}
            className="sr-only"
          />
          <div>
            <p className="text-white/80 text-sm font-medium">Subscribe to BCS Ratna Award Newsletter</p>
            <p className="text-white/40 text-xs mt-0.5">Stay updated with announcements, shortlists & ceremony news.</p>
          </div>
        </label>
      </div>

      {/* ── SUBMIT ── */}
      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-gold gap-3">
          Continue to Category Selection
          <ArrowRight size={16} />
        </button>
      </div>

    </form>
  );
}
