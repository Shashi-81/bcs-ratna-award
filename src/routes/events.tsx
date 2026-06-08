import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Upload, Plus } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { YEAR_ASSET_MAP } from "@/lib/pastEventAssets";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Past Events — BCS Ratna Award Editions" },
      { name: "description", content: "Relive every edition of the BCS Ratna Award from 2010 to 2024 — galleries, winners and highlights." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Past Events — BCS Ratna Award Editions" },
      { property: "og:description", content: "Relive every edition of the BCS Ratna Award from 2010 to 2024 — galleries, winners and highlights." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bcsratnaaward.com/events" },
      { property: "og:image", content: "/assets/BCS-Website-Logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Past Events — BCS Ratna Award Editions" },
      { name: "twitter:description", content: "15 years of award ceremonies — galleries and highlights." },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/events" }],
  }),
  validateSearch: (search: Record<string, unknown>): { manage?: boolean } => ({
    manage: search.manage === "true" ? true : undefined,
  }),
  component: EventsPage,
});

type YearData = {
  year: number;
  edition: string;
  editionRoman: string;
  photos: string[];
};

const EDITION_LABELS: Record<number, { label: string; roman: string }> = {
  2010: { label: "1st Edition", roman: "I" },
  2011: { label: "2nd Edition", roman: "II" },
  2012: { label: "3rd Edition", roman: "III" },
  2013: { label: "4th Edition", roman: "IV" },
  2014: { label: "5th Edition", roman: "V" },
  2015: { label: "6th Edition", roman: "VI" },
  2016: { label: "7th Edition", roman: "VII" },
  2017: { label: "8th Edition", roman: "VIII" },
  2018: { label: "9th Edition", roman: "IX" },
  2019: { label: "10th Edition", roman: "X" },
  2020: { label: "11th Edition", roman: "XI" },
  2021: { label: "12th Edition (XII)", roman: "XII" },
  2022: { label: "13th Edition (XIII)", roman: "XIII" },
  2023: { label: "14th Edition (XIV)", roman: "XIV" },
  2025: { label: "15th Edition (XV)", roman: "XV" },
};

const YEARS_LIST = [2025, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];

function getAssetPhotos(year: number): string[] {
  const asset = YEAR_ASSET_MAP[year];
  if (!asset) return [];
  const basePath = encodeURI(`/assets/Past event images/${asset.folder}`);
  return asset.files.map((file) => `${basePath}/${encodeURIComponent(file)}`);
}

function getDefaultPhotos(year: number): string[] {
  return Array.from({ length: 8 }, (_, i) =>
    `https://placehold.co/800x450/111111/C9A84C?text=Award+Ceremony+${year}`
  );
}

function loadPhotos(year: number): string[] {
  const assetPhotos = getAssetPhotos(year);
  if (typeof window === "undefined") return assetPhotos.length > 0 ? assetPhotos : getDefaultPhotos(year);
  try {
    const stored = localStorage.getItem(`bcs_photos_${year}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return assetPhotos.length > 0 ? assetPhotos : getDefaultPhotos(year);
}

function savePhotos(year: number, photos: string[]) {
  try {
    localStorage.setItem(`bcs_photos_${year}`, JSON.stringify(photos));
  } catch {}
}

// Animated counter hook
function useCounter(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function EventsPage() {
  const { manage } = Route.useSearch();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [yearPhotos, setYearPhotos] = useState<Record<number, string[]>>({});
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const openGallery = (year: number) => {
    const photos = loadPhotos(year);
    setYearPhotos((p) => ({ ...p, [year]: photos }));
    setSelectedYear(year);
  };

  const closeGallery = () => { setSelectedYear(null); setLightboxIndex(null); };

  const handleAddPhotos = (year: number, files: FileList) => {
    const current = yearPhotos[year] ?? loadPhotos(year);
    const readers = Array.from(files).slice(0, 50 - current.length).map((file) =>
      new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = (e) => resolve(e.target?.result as string);
        r.readAsDataURL(file);
      })
    );
    Promise.all(readers).then((newPhotos) => {
      const updated = [...current, ...newPhotos];
      savePhotos(year, updated);
      setYearPhotos((p) => ({ ...p, [year]: updated }));
    });
  };

  const currentPhotos = selectedYear
    ? yearPhotos[selectedYear] ?? (getAssetPhotos(selectedYear).length > 0 ? getAssetPhotos(selectedYear) : getDefaultPhotos(selectedYear))
    : [];

  const c1 = useCounter(15, 1800, statsVisible);
  const c2 = useCounter(500, 1800, statsVisible);
  const c3 = useCounter(5000, 2000, statsVisible);
  const c4 = useCounter(20, 1500, statsVisible);

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      {/* HERO */}
      <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
        <GoldParticles count={40} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <nav className="mb-6 font-cinzel text-[11px] text-white/50">
            <a href="/" className="hover:text-[#C9A84C] transition">Home</a>
            <span className="mx-2">›</span>
            <span className="text-[#C9A84C]">Past Events</span>
          </nav>
          <h1 className="font-display font-black text-5xl md:text-[64px] text-gold-gradient leading-tight">
            PAST AWARD CEREMONIES
          </h1>
          <div className="gold-divider" />
          <p className="text-white/70 mt-4 text-lg">14 Years of Celebrating Broadcasting Excellence</p>
        </div>
      </section>

      {/* STATS BAR */}
      <div ref={statsRef} className="bg-[#0d0d0d] border-y border-[#C9A84C]/20 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: c1, suffix: "", label: "Ceremonies" },
            { val: c2, suffix: "+", label: "Awards" },
            { val: c3, suffix: "+", label: "Attendees" },
            { val: c4, suffix: "+", label: "States Represented" },
          ].map((s) => (
            <div key={s.label} className="stat-box p-6 rounded-2xl">
              <div className="font-display text-4xl md:text-5xl text-gold-gradient font-bold number">
                {s.val}{s.suffix}
              </div>
              <div className="font-cinzel text-[11px] text-white/60 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* YEAR CARDS GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {YEARS_LIST.map((year, i) => {
              const edition = EDITION_LABELS[year];
              const assetPhotos = getAssetPhotos(year);
              const heroPhoto = assetPhotos[0] ?? `https://placehold.co/800x450/111111/C9A84C?text=Award+Ceremony+${year}`;
              return (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="group rounded-2xl overflow-hidden border border-[#C9A84C]/20 hover:border-[#C9A84C]/60 bg-[#111] transition-all duration-300 hover:-translate-y-1.5"
                  style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}
                >
                  {/* Card photo */}
                  <div className="relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center" style={{ height: "200px" }}>
                    <img
                      src={heroPhoto}
                      alt={`Award Ceremony ${year}`}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      style={{ borderRadius: "16px 16px 0 0" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-display text-[42px] text-gold-gradient font-bold leading-none">{year}</div>
                        <div className="font-cinzel text-[12px] text-white/60 mt-1">Award Ceremony</div>
                      </div>
                      <span
                        className="font-cinzel text-[10px] text-[#C9A84C] border border-[#C9A84C]/40 px-3 py-1 mt-1"
                        style={{ borderRadius: "50px" }}
                      >
                        {edition.label}
                      </span>
                    </div>

                    <button
                      onClick={() => openGallery(year)}
                      className="btn-outline-gold mt-4 w-full justify-center !py-2.5 text-[11px]"
                    >
                      VIEW GALLERY →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY MODAL */}
      <AnimatePresence>
        {selectedYear !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 overflow-y-auto"
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-[#C9A84C]/20 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-gold-gradient">
                  Award Ceremony {selectedYear} — {EDITION_LABELS[selectedYear].label}
                </h2>
                <p className="font-cinzel text-[10px] text-white/50 mt-0.5">BCS Ratna Award · Aavishkar Media Group</p>
              </div>
              <div className="flex items-center gap-3">
                {manage && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleAddPhotos(selectedYear, e.target.files)}
                    />
                    <span className="btn-outline-gold !py-2 !px-4 text-[10px] inline-flex items-center gap-1">
                      <Plus size={12} /> ADD PHOTOS
                    </span>
                  </label>
                )}
                <button
                  onClick={closeGallery}
                  className="w-10 h-10 rounded-full bg-[#C9A84C] text-black flex items-center justify-center hover:bg-white transition"
                  aria-label="Close gallery"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Photo grid — auto aspect ratio based on image orientation */}
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentPhotos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className="relative overflow-hidden rounded-xl border border-[#C9A84C]/15 hover:border-[#C9A84C]/60 group transition-all duration-300 bg-[#0a0a0a] flex items-center justify-center"
                    style={{ minHeight: "160px" }}
                  >
                    <img
                      src={src}
                      alt={`${selectedYear} ceremony photo ${i + 1}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ maxHeight: "280px", display: "block" }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 font-cinzel text-white text-[11px] transition-opacity">
                        VIEW →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedYear !== null && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/98 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={currentPhotos[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1}`}
                className="w-full max-h-[80vh] object-contain rounded-xl border border-[#C9A84C]/30"
              />

              {/* Counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full">
                <span className="font-cinzel text-xs text-[#C9A84C]">
                  {lightboxIndex + 1} / {currentPhotos.length}
                </span>
              </div>

              {/* Prev */}
              <button
                onClick={() => setLightboxIndex((lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length)}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#C9A84C]/20 hover:bg-[#C9A84C] text-[#C9A84C] hover:text-black transition-all flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Next */}
              <button
                onClick={() => setLightboxIndex((lightboxIndex + 1) % currentPhotos.length)}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#C9A84C]/20 hover:bg-[#C9A84C] text-[#C9A84C] hover:text-black transition-all flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>

              {/* Close */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#C9A84C] text-black hover:bg-white transition flex items-center justify-center font-bold text-xl"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
