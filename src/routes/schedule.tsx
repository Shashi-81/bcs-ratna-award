import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Event Schedule & Programme | BCS Ratna Award 2026" },
      { name: "description", content: "Full programme schedule for BCS Ratna Award 2026 ceremony — timings, agenda, award categories sequence and gala dinner." },
      { property: "og:title", content: "Event Schedule & Programme | BCS Ratna Award 2026" },
      { property: "og:description", content: "Timings, agenda, gala dinner — the full programme for BCS Ratna Award 2026." },
      { property: "og:url", content: "/schedule" },
    ],
    links: [{ rel: "canonical", href: "/schedule" }],
  }),
  component: SchedulePage,
});

const TARGET = new Date("2026-03-20T18:00:00+05:30").getTime();
function useCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const PRE = [
  ["03:00 PM", "📋", "Registration & Accreditation Desk Opens", "Collect your invitation kit and badge at the main entrance."],
  ["04:00 PM", "🤝", "Industry Networking Session", "Pre-event networking in the foyer. Connect with 500+ industry leaders over refreshments."],
  ["05:30 PM", "📸", "Red Carpet Arrivals", "Official photography and media interactions. Dress code: Black Tie / Indian Formal."],
  ["06:00 PM", "🚪", "Main Hall Doors Open", "Take your seats. Pre-show entertainment begins."],
] as const;

const MAIN = [
  ["06:30 PM", "🎙️", "Welcome Address", "Opening remarks by Chairman, Aavishkar Media Group."],
  ["06:45 PM", "🎬", "Highlights Reel", "14 years of BCS Ratna Award — a cinematic journey."],
  ["07:00 PM", "🏆", "Award Presentations Begin", "Content Sector Awards — 7 categories."],
  ["07:45 PM", "🎤", "Keynote Address", "Special address by Chief Guest."],
  ["08:00 PM", "🏆", "Distribution & Technology Awards", "Distribution Sector + Technology & Innovation — 12 categories."],
  ["08:45 PM", "🎵", "Cultural Performance", "Special entertainment performance."],
  ["09:00 PM", "🏆", "Digital & Individual Awards", "Digital Platform + Digital Creator + Individual Sector."],
  ["09:45 PM", "🌟", "Lifetime Achievement Award", "The evening's most prestigious honour."],
  ["10:00 PM", "🥂", "Vote of Thanks & Closing", "Closing address and acknowledgements."],
  ["10:15 PM", "🍽️", "Gala Dinner & Networking", "Fine dining, live music, networking. Concludes 12:00 AM."],
] as const;

const NOTES = [
  ["Invitation Required", "Entry by invitation only. Please carry your invitation kit and ID."],
  ["No Transfers", "Duplicate or transferred invitations will not be accepted."],
  ["Photography", "Personal photography permitted; professional rigs require press accreditation."],
  ["Social Media", "Tag your moments with #BCSRatnaAward2026."],
  ["Parking", "On-site parking opens at 2:30 PM. Valet available at the main porch."],
] as const;

function SchedulePage() {
  const t = useCountdown();
  const [openNote, setOpenNote] = useState<number | null>(0);

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">The Evening</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">EVENT PROGRAMME 2026</h1>
          <div className="gold-divider" />
          <p className="text-white/75 mt-4 text-lg italic font-display">An Evening of Glamour, Recognition & Excellence</p>
          <p className="font-cinzel text-[11px] text-[#C9A84C] mt-3">March 20, 2026 · Doors Open 6:00 PM</p>

          <div className="mt-10">
            <p className="font-cinzel text-xs text-[#C9A84C] mb-4">Event Begins In</p>
            <div className="flex justify-center gap-3 sm:gap-5">
              {[["Days", t.d], ["Hours", t.h], ["Minutes", t.m], ["Seconds", t.s]].map(([label, val]) => (
                <div key={label as string} className="glass-card px-3 py-3 sm:px-5 sm:py-4 min-w-[68px] sm:min-w-[88px]">
                  <div className="font-display text-2xl sm:text-4xl text-gold-gradient font-bold">{String(val).padStart(2, "0")}</div>
                  <div className="font-cinzel text-[9px] text-white/60 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Timeline title="Pre-Event Timeline" items={PRE} />
      <Timeline title="Main Ceremony" items={MAIN} />

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="glass-card p-8 text-center">
          <div className="text-3xl">👔</div>
          <h3 className="font-display text-2xl font-semibold text-white mt-3">Dress Code: Black Tie / Indian Formal</h3>
          <p className="text-white/70 mt-3">Gentlemen: Suit & Tie or Sherwani</p>
          <p className="text-white/70">Ladies: Evening Gown or Designer Saree / Lehenga</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">Please Note</p>
          <h2 className="font-display text-3xl font-bold text-white">Important Information</h2>
          <div className="gold-divider" />
        </div>
        <div className="space-y-3">
          {NOTES.map(([title, body], i) => {
            const open = openNote === i;
            return (
              <div key={title} className="glass-card overflow-hidden">
                <button onClick={() => setOpenNote(open ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-cinzel text-xs text-white/90">{title}</span>
                  <ChevronDown size={18} className={`text-[#C9A84C] transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && <p className="px-5 pb-5 text-sm text-white/70 leading-relaxed">{body}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24 flex flex-wrap gap-3 justify-center">
        <Link to="/contact" className="btn-outline-gold">Become a Sponsor</Link>
        <Link to="/venue" className="btn-outline-gold">Venue Details</Link>
      </section>

      <Footer />
    </div>
  );
}

function Timeline({ title, items }: { title: string; items: ReadonlyArray<readonly [string, string, string, string]> }) {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-16">
      <div className="text-center mb-10">
        <p className="font-cinzel text-xs text-[#C9A84C] mb-3">{title}</p>
        <div className="gold-divider" />
      </div>
      <div className="relative pl-8 md:pl-12">
        <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A84C]/60 via-[#C9A84C]/30 to-transparent" />
        {items.map(([time, icon, head, body], i) => (
          <div key={i} className="relative pb-8 last:pb-0">
            <div className="absolute -left-6 md:-left-8 top-1.5 w-3 h-3 rounded-full bg-gold-gradient shadow-[0_0_12px_rgba(201,168,76,0.7)]" />
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-cinzel text-[11px] text-[#C9A84C]">{time}</span>
                <span className="text-xl">{icon}</span>
                <h4 className="font-display text-lg md:text-xl font-semibold text-white">{head}</h4>
              </div>
              <p className="text-sm text-white/65 mt-2 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
