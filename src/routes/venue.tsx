import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { MapPin, Phone, Star, Plane, Train, Car, Hotel, Mail } from "lucide-react";

export const Route = createFileRoute("/venue")({
  head: () => ({
    meta: [
      { title: "Venue & Directions | BCS Ratna Award 2026 — New Delhi" },
      { name: "description", content: "Find complete venue details, directions, hotel recommendations and parking info for BCS Ratna Award 2026 ceremony." },
      { property: "og:title", content: "Venue & Directions | BCS Ratna Award 2026" },
      { property: "og:description", content: "Complete venue, maps, hotels and travel info for the BCS Ratna Award 2026 ceremony in New Delhi." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/venue" },
    ],
    links: [{ rel: "canonical", href: "/venue" }],
  }),
  component: VenuePage,
});

function VenuePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">The Ceremony</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">EVENT VENUE 2026</h1>
          <div className="gold-divider" />
          <p className="text-white/75 mt-4 text-lg">BCS Ratna Award Ceremony — New Delhi</p>
          <span className="inline-block mt-6 px-5 py-2 rounded-full font-cinzel text-[11px] bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/40">
            March 2026 · New Delhi, India
          </span>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="glass-card p-10 md:p-14 text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Hotel Ashok, New Delhi</h2>
          <p className="text-white/70 mt-3 flex items-center justify-center gap-2"><MapPin size={16} className="text-[#C9A84C]" /> 50-B, Chanakyapuri, New Delhi - 110021</p>
          <p className="text-white/70 mt-2 flex items-center justify-center gap-2"><Phone size={16} className="text-[#C9A84C]" /> +91-11-2611-0101</p>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-[#C9A84C]" fill="#C9A84C" />)}
          </div>
          <span className="inline-block mt-5 px-5 py-2 rounded-full font-cinzel text-[10px] bg-gold-gradient text-black">
            Official Award Ceremony Venue
          </span>
          <div className="mt-8">
            <a href="https://www.google.com/maps/dir/?api=1&destination=Hotel+Ashok+New+Delhi" target="_blank" rel="noreferrer" className="btn-gold">
              Get Directions →
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: "🎭", title: "Grand Ballroom", text: "Capacity 1000+ guests" },
            { icon: "🎬", title: "State-of-art AV", text: "HD screens, pro lighting" },
            { icon: "🍽️", title: "Fine Dining", text: "Gala dinner included" },
            { icon: "🚗", title: "Ample Parking", text: "500+ vehicles" },
          ].map((h) => (
            <div key={h.title} className="glass-card p-6 text-center hover:-translate-y-1 transition">
              <div className="text-3xl mb-3">{h.icon}</div>
              <h3 className="font-display text-xl font-semibold text-white">{h.title}</h3>
              <p className="text-sm text-white/60 mt-2">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="border border-[#C9A84C]/30 rounded overflow-hidden">
          <iframe
            title="Venue Map"
            src="https://www.google.com/maps?q=Hotel+Ashok+Chanakyapuri+New+Delhi&output=embed"
            width="100%"
            height="450"
            style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Plane, title: "By Air", text: "Indira Gandhi International Airport is 15 km from venue. Pre-paid taxi available at airport exit. Approx travel time: 30–45 minutes." },
            { icon: Train, title: "By Metro", text: "Nearest Metro: Udyog Bhawan (Yellow Line). Exit Gate 2, 5 min walk to venue. Metro runs every 5 minutes during peak hours." },
            { icon: Car, title: "By Road", text: "From Connaught Place: 20 min via Shanti Path. From South Delhi: 25 min via Ring Road. From Noida: 45 min via DND Flyway. Parking available." },
          ].map((d) => (
            <div key={d.title} className="glass-card p-8">
              <d.icon size={32} className="text-[#C9A84C]" />
              <h3 className="font-display text-2xl font-semibold text-white mt-4">{d.title}</h3>
              <p className="text-sm text-white/65 mt-3 leading-relaxed">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">Where to Stay</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Recommended Hotels</h2>
          <div className="gold-divider" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "The Taj Mahal Hotel", stars: 5, distance: "2 km", price: "₹12,000" },
            { name: "Hotel Samrat", stars: 4, distance: "0.5 km", price: "₹6,500" },
            { name: "The Imperial New Delhi", stars: 5, distance: "3 km", price: "₹15,000" },
          ].map((h) => (
            <div key={h.name} className="glass-card p-7 hover:-translate-y-1 transition">
              <Hotel size={28} className="text-[#C9A84C]" />
              <h3 className="font-display text-xl font-semibold text-white mt-4">{h.name}</h3>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(h.stars)].map((_, i) => <Star key={i} size={14} className="text-[#C9A84C]" fill="#C9A84C" />)}
              </div>
              <p className="text-sm text-white/65 mt-3">{h.distance} from venue</p>
              <p className="font-display text-2xl text-gold-gradient font-bold mt-2">{h.price}<span className="text-sm text-white/50 font-sans">/night</span></p>
              <a href="#" className="btn-outline-gold mt-5 w-full justify-center">Book Now</a>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="glass-card p-10 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">Logistics & Travel</p>
          <h3 className="font-display text-2xl font-semibold text-white">For group bookings and travel assistance</h3>
          <div className="mt-6 flex flex-col sm:flex-row gap-5 justify-center text-white/75">
            <a href="mailto:logistics@aavishkargroup.in" className="inline-flex items-center gap-2 hover:text-[#C9A84C]"><Mail size={16} /> logistics@aavishkargroup.in</a>
            <a href="tel:+919811120650" className="inline-flex items-center gap-2 hover:text-[#C9A84C]"><Phone size={16} /> +91-9811120650</a>
          </div>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/schedule" className="btn-outline-gold">View Schedule</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
