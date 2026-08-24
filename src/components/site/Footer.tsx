import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import logoTextImg from "@/assets/BCS-Website-Logo.png";

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white">
      <div className="border-b border-[#C9A84C]/20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <img
              src={logoTextImg}
              alt="BCS Ratna Award"
              className="h-16 w-auto object-contain"
            />
            <p className="uppercase text-xs tracking-[0.35em] text-[#C9A84C]">Broadcasting • Content • Social</p>
            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              India's most prestigious Broadcasting, Cable & Satellite industry award by Aavishkar Media Group.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
              />
              <button className="rounded-full bg-gradient-to-r from-[#D4B55C] to-[#F9E07B] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110">
                Subscribe
              </button>
            </form>
          </div>

          <FooterCol title="Quick Links" links={[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/categories", label: "Categories" },
            { to: "/events", label: "Past Events" },
            { to: "/contact", label: "Contact" },
          ]} />

          <FooterCol title="Event Info" links={[
            { to: "/schedule", label: "Schedule & Programme" },
            { to: "/venue", label: "Venue & Directions" },
          ]} />

          <div>
            <h4 className="font-cinzel text-sm text-[#C9A84C] mb-5">Reach Us</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin size={18} className="text-[#C9A84C] shrink-0 mt-0.5" />
                <span>B-263, Indra Nagar, Adarsh Nagar, New Delhi-110033</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-[#C9A84C] shrink-0 mt-0.5" />
                <span>+91-9811120650<br />+91-9811930420</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-[#C9A84C] shrink-0 mt-0.5" />
                <a href="mailto:info@aavishkargroup.in" className="text-white/80 hover:text-[#C9A84C] transition">
                  info@aavishkargroup.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-white/50">
        <p>© 2026 BCS Ratna Award · Aavishkar Media Pvt. Ltd. · All Rights Reserved</p>
        <div className="flex items-center gap-3">
          {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-black">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-cinzel text-[13px] text-[#C9A84C] mb-5">{title}</h4>
      <ul className="space-y-3 text-[14px] text-white/65">
        {links.map((l, i) => (
          <li key={i}><Link to={l.to} className="hover:text-[#C9A84C] transition">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
