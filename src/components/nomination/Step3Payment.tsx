import React, { useState } from "react";
import { ArrowLeft, Check, Shield, Lock, AlertCircle, CreditCard } from "lucide-react";
import type { EntryForm } from "./Step2Categories";
import { SECTORS, getCategoriesForSector, PRICE_PER_CATEGORY, calcTotal } from "@/lib/nomination-data";

export interface PaymentData {
  method: "razorpay" | "pay_later";
  screenshot_file: null;
  transaction_id: string;
  payment_reference: string;
  declaration: boolean;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface Props {
  entries: EntryForm[];
  registrantName: string;
  registrantEmail: string;
  registrantMobile: string;
  onSubmit: (data: PaymentData) => Promise<void>;
  onSaveDraft: () => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

function getCategoryLabel(entry: EntryForm): string {
  const cats = getCategoriesForSector(entry.sector, entry.sub_sector || undefined);
  return cats.find((c) => c.id === entry.category)?.label ?? entry.category;
}

function getSectorLabel(id: string): string {
  return SECTORS.find((s) => s.id === id)?.label ?? id;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const sectionCls = "bg-[#0e0e0e] border border-white/8 rounded-2xl p-6 mb-5";

export function Step3Payment({
  entries, registrantName, registrantEmail, registrantMobile,
  onSubmit, onSaveDraft, onBack, isSubmitting,
}: Props) {
  const total = calcTotal(entries.length);
  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [payLaterLoading, setPayLaterLoading] = useState(false);

  async function handleRazorpay() {
    if (!declaration) {
      setErrors({ declaration: "Please agree to the declaration before proceeding" });
      document.getElementById("declaration-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setRazorpayLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrors({ razorpay: "Failed to load Razorpay. Please check your connection and try again." });
      setRazorpayLoading(false);
      return;
    }

    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID ?? "";

    if (!RAZORPAY_KEY) {
      setErrors({ razorpay: "Payment gateway not configured. Please contact support." });
      setRazorpayLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: total * 100, // in paise
      currency: "INR",
      name: "BCS Ratna Award 2026",
      description: `${entries.length} Nomination${entries.length > 1 ? "s" : ""} — BCS Ratna Award 2026`,
      image: "/assets/BCS-Trophy-Website-Logo.png",
      prefill: {
        name: registrantName,
        email: registrantEmail,
        contact: `+91${registrantMobile}`,
      },
      notes: {
        registrant: registrantName,
        email: registrantEmail,
        categories: String(entries.length),
      },
      theme: { color: "#C9A84C" },
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id?: string;
        razorpay_signature?: string;
      }) {
        setRazorpayLoading(false);
        await onSubmit({
          method: "razorpay",
          screenshot_file: null,
          transaction_id: response.razorpay_payment_id,
          payment_reference: response.razorpay_order_id ?? "",
          declaration: true,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => setRazorpayLoading(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      setErrors({ razorpay: "Payment failed. Please try again." });
      setRazorpayLoading(false);
    });
    rzp.open();
  }

  async function handlePayLater() {
    if (!declaration) {
      setErrors({ declaration: "Please agree to the declaration before proceeding" });
      document.getElementById("declaration-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPayLaterLoading(true);
    try {
      await onSubmit({
        method: "pay_later",
        screenshot_file: null,
        transaction_id: "",
        payment_reference: "",
        declaration: true,
      });
    } finally {
      setPayLaterLoading(false);
    }
  }

  return (
    <div>
      {/* ── ORDER SUMMARY ── */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/6">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/15 flex items-center justify-center">
            <CreditCard size={15} className="text-[#C9A84C]" />
          </div>
          <h3 className="font-semibold text-white text-sm tracking-wide">Order Summary</h3>
        </div>
        <div className="space-y-2.5">
          {entries.map((entry, i) => (
            <div key={entry.id} className="flex items-start justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex-1 pr-4 min-w-0">
                <p className="text-white text-sm font-medium truncate">{i + 1}. {entry.nominee_name || "—"}</p>
                <p className="text-white/45 text-xs mt-0.5 truncate">
                  {getSectorLabel(entry.sector)} › {getCategoryLabel(entry)}
                </p>
              </div>
              <p className="text-[#C9A84C] text-sm font-bold whitespace-nowrap shrink-0">
                ₹{PRICE_PER_CATEGORY.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#C9A84C]/20">
          <div>
            <p className="text-white/55 text-xs">{entries.length} categor{entries.length === 1 ? "y" : "ies"} × ₹11,800</p>
            <p className="text-white/30 text-xs mt-0.5">Inclusive of 18% GST</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs mb-0.5">Total Payable</p>
            <p className="text-[#C9A84C] font-display text-3xl font-bold">₹{total.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* ── RAZORPAY PAYMENT ── */}
      <div className={sectionCls}>
        <div className="bg-[#111] border border-[#C9A84C]/20 rounded-xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#C9A84C]/15 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-[#C9A84C]" />
          </div>
          <p className="text-white font-semibold text-base mb-1">Secure Payment via Razorpay</p>
          <p className="text-white/45 text-sm mb-5 max-w-xs mx-auto leading-relaxed">
            Pay securely with any card, UPI app, net banking or wallet. Powered by Razorpay.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {["Visa", "Mastercard", "RuPay", "UPI", "Paytm", "PhonePe", "GPay"].map((m) => (
              <span key={m} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-white/50 text-xs">{m}</span>
            ))}
          </div>
          {errors.razorpay && (
            <p className="flex items-center justify-center gap-1.5 text-[#E8A87C] text-xs mb-3">
              <AlertCircle size={12} />{errors.razorpay}
            </p>
          )}
          <p className="text-white/30 text-xs">
            Tick the declaration below, then click <strong className="text-white/50">Pay Now</strong>
          </p>
        </div>
      </div>

      {/* ── DECLARATION ── */}
      <div id="declaration-section" className={sectionCls}>
        <div className="flex items-start gap-4">
          <input
            id="declaration-checkbox"
            type="checkbox"
            checked={declaration}
            onChange={(e) => { setDeclaration(e.target.checked); setErrors((p) => ({ ...p, declaration: "" })); }}
            className="sr-only"
          />
          <label htmlFor="declaration-checkbox" className="flex items-start gap-4 cursor-pointer group flex-1">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
              ${declaration ? "bg-[#C9A84C] border-[#C9A84C]" : "border-white/20 group-hover:border-[#C9A84C]/50"}`}
            >
              {declaration && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                I hereby certify that all information submitted in this nomination is true, accurate and complete.
              </p>
              <p className="text-white/45 text-xs mt-1 leading-relaxed">
                I authorise Aavishkar Media Pvt. Ltd. to verify and use this information for the BCS Ratna Award 2026 evaluation process.
              </p>
            </div>
          </label>
        </div>
        {errors.declaration && (
          <p className="flex items-center gap-1.5 text-[#E8A87C] text-xs mt-3 ml-9">
            <AlertCircle size={11} />{errors.declaration}
          </p>
        )}
      </div>

      {/* ── TRUST BADGES ── */}
      <div className="flex flex-wrap items-center justify-center gap-5 mb-6 text-white/30 text-xs">
        <span className="flex items-center gap-1.5"><Shield size={12} className="text-[#C9A84C]" />SSL Secured</span>
        <span className="flex items-center gap-1.5"><Lock size={12} className="text-[#C9A84C]" />Data Protected</span>
        <span className="flex items-center gap-1.5"><Check size={12} className="text-[#C9A84C]" />Official BCS Award</span>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={onBack} className="btn-outline-gold text-sm sm:order-1">
          <ArrowLeft size={16} /> Back
        </button>
        <button type="button" onClick={onSaveDraft} disabled={isSubmitting}
          className="btn-outline-gold text-sm sm:order-2">
          Save Draft
        </button>
        <button
          type="button"
          onClick={handlePayLater}
          disabled={isSubmitting || razorpayLoading || payLaterLoading}
          className="hidden btn-outline-gold text-sm justify-center sm:order-3"
        >
          {payLaterLoading ? (
            <><span className="w-4 h-4 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />Submitting…</>
          ) : (
            <>Pay Later</>
          )}
        </button>
        <button
          type="button"
          onClick={handleRazorpay}
          disabled={isSubmitting || razorpayLoading || payLaterLoading}
          className="btn-gold flex-1 text-sm justify-center sm:order-4"
        >
          {razorpayLoading ? (
            <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Opening Payment…</>
          ) : isSubmitting ? (
            <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Processing…</>
          ) : (
            <><Lock size={14} />Pay Now</>
          )}
        </button>
      </div>
    </div>
  );
}
