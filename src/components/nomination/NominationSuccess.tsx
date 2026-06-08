import React from "react";
import { Check, Copy, Share2, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface Props {
  nominationId: string;
  registrantName: string;
  entriesCount: number;
  totalAmount: number;
}

export function NominationSuccess({ nominationId, registrantName, entriesCount, totalAmount }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(nominationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="text-center py-10">
      {/* Animated checkmark */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-gold-gradient opacity-20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center">
          <Check size={40} className="text-black" strokeWidth={3} />
        </div>
      </div>

      <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-3">
        Nomination Submitted!
      </h2>
      <p className="text-white/65 text-sm max-w-md mx-auto mb-8">
        Congratulations <strong className="text-white">{registrantName}</strong>. Your nomination has been received. Our team will review and contact you within 3–5 business days.
      </p>

      {/* Nomination ID */}
      <div className="inline-flex items-center gap-3 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl px-5 py-3 mb-8">
        <Award size={16} className="text-[#C9A84C] shrink-0" />
        <div className="text-left">
          <p className="text-white/45 text-xs">Nomination Reference ID</p>
          <p className="text-[#C9A84C] font-mono font-bold text-sm tracking-wider">{nominationId}</p>
        </div>
        <button onClick={copy} className="text-white/40 hover:text-[#C9A84C] transition-colors ml-2">
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <p className="text-white/45 text-xs mb-1">Categories Nominated</p>
          <p className="text-white font-display text-2xl font-bold">{entriesCount}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <p className="text-white/45 text-xs mb-1">Amount Paid</p>
          <p className="text-[#C9A84C] font-display text-2xl font-bold">₹{totalAmount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 mb-8 max-w-md mx-auto text-left">
        <p className="text-white/60 font-cinzel text-xs mb-3">What Happens Next</p>
        {[
          "Confirmation email sent to your registered address",
          "Payment verification within 24 hours",
          "Nomination review by independent jury panel",
          "Shortlist announcement 30 days before ceremony",
          "Award Ceremony — BCS Ratna Award 2026",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 mb-2.5">
            <span className="w-5 h-5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-xs flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-white/60 text-xs leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-outline-gold text-sm">Back to Home</Link>
        <a
          href={`https://wa.me/919811120650?text=I have submitted my nomination for BCS Ratna Award 2026. Reference ID: ${nominationId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold text-sm"
        >
          <Share2 size={14} /> Share on WhatsApp
        </a>
      </div>
    </div>
  );
}
