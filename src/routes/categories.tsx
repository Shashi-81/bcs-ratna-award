import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { CATEGORIES } from "@/lib/categories";
import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Award Categories — BCS Ratna 2026" },
      { name: "description", content: "80+ award categories across 6 sectors: Content, Distribution, Technology, Digital Platform, Creator and Individual." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Award Categories — BCS Ratna 2026" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bcsratnaaward.com/categories" },
      { property: "og:image", content: "/assets/BCS-Website-Logo.png" },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const totalCategories = CATEGORIES.reduce((acc, c) => {
    if (c.subsectors) return acc + c.subsectors.reduce((a, ss) => a + ss.items.length, 0);
    return acc + c.subcategories.length;
  }, 0);

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-[80px] pb-10 overflow-hidden">
        <GoldParticles count={20} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.15),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">BCS Ratna Award 2026</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gold-gradient">Nomination Categories</h1>
          <div className="gold-divider" />
          <p className="text-white/60 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            {CATEGORIES.length} sectors · {totalCategories}+ award categories · Independent expert jury
          </p>
          <div className="mt-6">
            <Link to="/nominate" className="btn-gold inline-flex items-center gap-2">
              Nominate Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CATEGORIES.map((c) => {
            const count = c.subsectors
              ? c.subsectors.reduce((a, ss) => a + ss.items.length, 0)
              : c.subcategories.length;
            const isOpen = openId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setOpenId(isOpen ? null : c.id)}
                className={`text-left rounded-2xl border p-5 transition-all duration-300 group
                  ${isOpen
                    ? "border-[#C9A84C]/60 bg-[#C9A84C]/8 shadow-[0_0_24px_rgba(201,168,76,0.12)]"
                    : "border-white/10 bg-[#0e0e0e] hover:border-[#C9A84C]/40 hover:bg-[#0e0e0e]"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${isOpen ? "bg-[#C9A84C]" : "bg-white/5 group-hover:bg-[#C9A84C]/20"}`}>
                    <c.icon size={20} className={isOpen ? "text-black" : "text-[#C9A84C]"} />
                  </div>
                  <div className={`mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown size={16} className="text-[#C9A84C]" />
                  </div>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-3 leading-snug">{c.name}</h3>
                <p className="text-white/50 text-sm mt-1.5">{c.short}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[#C9A84C]/70 text-xs">{count} categories</span>
                  <span className={`text-xs font-medium transition-colors ${isOpen ? "text-[#C9A84C]" : "text-white/30 group-hover:text-[#C9A84C]/60"}`}>
                    {isOpen ? "Hide" : "View all"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded Panel */}
        {openId && (() => {
          const cat = CATEGORIES.find((c) => c.id === openId);
          if (!cat) return null;
          return (
            <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#0a0a0a] overflow-hidden mb-8">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#C9A84C]/15">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A84C] flex items-center justify-center shrink-0">
                    <cat.icon size={18} className="text-black" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">{cat.name}</h2>
                    <p className="text-white/50 text-sm mt-0.5">{cat.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  className="text-white/40 hover:text-white text-2xl leading-none ml-4 shrink-0"
                >✕</button>
              </div>

              {/* Categories List */}
              <div className="p-6">
                {cat.subsectors ? (
                  cat.subsectors.map((ss) => (
                    <div key={ss.label} className="mb-6 last:mb-0">
                      <p className="text-[#C9A84C] text-sm font-cinzel mb-4 pb-2 border-b border-[#C9A84C]/15">
                        {ss.label}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {ss.items.map((item) => (
                          <div key={item} className="flex items-start gap-3 px-4 py-3 bg-white/[0.02] border border-white/8 rounded-xl">
                            <span className="text-[#C9A84C] text-sm mt-0.5 shrink-0">◆</span>
                            <span className="text-white/80 text-sm leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {cat.subcategories.map((item) => (
                      <div key={item} className="flex items-start gap-3 px-4 py-3 bg-white/[0.02] border border-white/8 rounded-xl">
                        <span className="text-[#C9A84C] text-sm mt-0.5 shrink-0">◆</span>
                        <span className="text-white/80 text-sm leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nominate CTA */}
                <div className="mt-6 pt-5 border-t border-[#C9A84C]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-white/50 text-sm">
                    ₹<span className="text-[#C9A84C] font-bold text-base">11,800</span> per category · Inclusive of 18% GST
                  </p>
                  <Link to="/nominate" className="btn-gold text-sm px-6 py-3 whitespace-nowrap">
                    Nominate in this Sector →
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <div className="glass-card p-8">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-gold-gradient mb-3">
            Ready to Nominate?
          </h2>
          <p className="text-white/55 mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Select multiple categories across any sector in a single submission. ₹11,800 per category inclusive of GST.
          </p>
          <Link to="/nominate" className="btn-gold text-sm px-8 py-3 inline-flex items-center gap-2">
            Start Nomination <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
