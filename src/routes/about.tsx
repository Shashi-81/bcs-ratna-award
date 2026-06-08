import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Quote, Target, Eye, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BCS Ratna Award — Aavishkar Media Group" },
      { name: "description", content: "Fifteen years of honouring excellence in India's broadcasting, cable, satellite and digital media industry." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "About BCS Ratna Award — Aavishkar Media Group" },
      { property: "og:description", content: "Fifteen years of honouring excellence in India's broadcasting, cable, satellite and digital media industry." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bcsratnaaward.com/about" },
      { property: "og:image", content: "/assets/BCS-Website-Logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About BCS Ratna Award — Aavishkar Media Group" },
      { name: "twitter:description", content: "Fifteen years of honouring excellence in India's broadcasting, cable, satellite and digital media industry." },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/about" }],
  }),
  component: AboutPage,
});

const TIMELINE = [
  { year: "2010", event: "BCS Ratna Award founded by Aavishkar Media Group in New Delhi." },
  { year: "2013", event: "Expanded to include Digital Media and OTT categories." },
  { year: "2015", event: "First nationally televised ceremony, viewed by 12M households." },
  { year: "2017", event: "Crossed 250 partner organisations across India." },
  { year: "2019", event: "10th edition gala with international jury panel." },
  { year: "2022", event: "Introduced Digital Creator and AI/ML innovation honours." },
  { year: "2024", event: "Record 4,200+ nominations from across the subcontinent." },
  { year: "2026", event: "The 16th edition — the most ambitious yet." },
];

const TEAM = [
  { name: "R. K. Sharma", role: "Chairman" },
  { name: "Neha Aggarwal", role: "Executive Director" },
  { name: "Vikram Singh", role: "Jury Convenor" },
  { name: "Priya Bansal", role: "Head of Operations" },
];

function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <img src="/assets/BCS-Trophy-Website-Logo.png" alt="BCS Ratna Award" className="mx-auto mb-6 w-auto" style={{ height: "72px" }} />
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">A Legacy of Honour</h1>
          <div className="gold-divider" />
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Since 2010, the BCS Ratna Award has been India's definitive recognition of excellence in broadcasting, cable, satellite and digital media.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Mission", text: "To recognise and celebrate those who shape India's media landscape with vision, courage and craft." },
            { icon: Eye, title: "Vision", text: "To be the most credible, transparent and aspirational honour in Asian broadcasting." },
            { icon: Award, title: "Values", text: "Integrity. Independence. Excellence. Inclusivity. Innovation." },
          ].map((i) => (
            <div key={i.title} className="glass-card p-8">
              <i.icon size={28} className="text-[#C9A84C]" />
              <h3 className="font-display text-2xl mt-4">{i.title}</h3>
              <p className="text-sm text-white/65 mt-3 leading-relaxed">{i.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTitle eyebrow="The Journey" title="Milestones |2010 — 2026|" />
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#C9A84C]/40" />
            {TIMELINE.map((m, i) => (
              <div key={m.year} className={`relative flex md:items-center mb-10 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold-gradient ring-4 ring-black" />
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-10">
                  <div className="glass-card p-6">
                    <p className="font-display text-3xl text-gold-gradient font-bold">{m.year}</p>
                    <p className="text-sm text-white/70 mt-2">{m.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
