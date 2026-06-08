import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Award Categories — BCS Ratna 2026" },
      { name: "description", content: "Six award sectors: Content, Distribution, Technology, Digital Platform, Creator and Individual. Nominate across 30+ sub-categories." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Award Categories — BCS Ratna 2026" },
      { property: "og:description", content: "Six award sectors: Content, Distribution, Technology, Digital Platform, Creator and Individual. Nominate across 30+ sub-categories." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bcsratnaaward.com/categories" },
      { property: "og:image", content: "/assets/BCS-Website-Logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Award Categories — BCS Ratna 2026" },
      { name: "twitter:description", content: "Six award sectors across India's broadcasting and digital ecosystem." },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">The Six Pillars</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">Award Categories</h1>
          <div className="gold-divider" />
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Each sector represents a vital force in India's broadcasting story. Every nomination is reviewed by an independent expert jury.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-12">
        {CATEGORIES.map((c, i) => (
          <div key={c.id} className={`grid lg:grid-cols-5 gap-10 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="lg:col-span-2 relative">
              <div className="absolute -inset-3 bg-gold-gradient opacity-40 blur-2xl" />
              <div className="relative aspect-[4/3] overflow-hidden border-2 border-[#C9A84C]/50 bg-[#0d0d0d] flex items-center justify-center">
                <c.icon size={88} className="text-[#C9A84C]" />
              </div>
            </div>
            <div className="lg:col-span-3 glass-card p-10">
              <p className="font-cinzel text-[10px] text-[#C9A84C]">Sector {String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">{c.name}</h2>
              <div className="gold-divider !mx-0" />
              <p className="text-white/70 mt-4">{c.description}</p>
              <ul className="grid sm:grid-cols-2 gap-2 mt-6">
                {c.subcategories.map((s) => (
                  <li key={s} className="text-sm text-white/75 flex items-start gap-2"><span className="text-[#C9A84C]">◆</span>{s}</li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-[#C9A84C]/20">
                <Link
                  to="/nominate"
                  className="btn-outline-gold inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                >
                  Nominate Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
