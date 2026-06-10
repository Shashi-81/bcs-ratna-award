import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { CalendarDays, Clock } from "lucide-react";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule & Programme | BCS Ratna Award 2026" },
      { name: "description", content: "Event schedule for BCS Ratna Award 2026 ceremony — coming soon." },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/schedule" }],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6">
            <CalendarDays size={32} className="text-[#C9A84C]" />
          </div>
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3 tracking-widest">BCS Ratna Award 2026</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-4">
            Schedule & Programme
          </h1>
          <div className="gold-divider" />
          <div className="mt-6 glass-card px-8 py-6 inline-flex items-center gap-3">
            <Clock size={18} className="text-[#C9A84C] shrink-0" />
            <p className="font-cinzel text-sm text-white/70 tracking-widest">COMING SOON</p>
          </div>
          <p className="text-white/50 text-sm mt-5 leading-relaxed">
            Full event programme will be published closer to the ceremony.<br/>
            <span className="text-[#C9A84C]">5th August 2026</span>
          </p>
          <div className="mt-8">
            <Link to="/" className="btn-outline-gold text-sm">← Back to Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
