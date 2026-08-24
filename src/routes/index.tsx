import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Award, ChevronDown, ChevronUp, Globe, Handshake, TrendingUp, Play } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { SectionTitle } from "@/components/site/SectionTitle";
import { CATEGORIES } from "@/lib/categories";
import trophyPng from "@/assets/Trophy.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BCS Ratna Award 2026 — India's Premier Broadcasting & Media Award" },
      { name: "description", content: "Celebrating Excellence in Broadcasting, Digital Media & Technology since 2010." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "BCS Ratna Award 2026" },
      { property: "og:description", content: "India's Most Prestigious Media Industry Award." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bcsratnaaward.com/" },
      { property: "og:image", content: "/assets/BCS-Website-Logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BCS Ratna Award 2026" },
      { name: "twitter:description", content: "India's Most Prestigious Media Industry Award." },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BCS Ratna Award",
        "url": "https://bcsratnaaward.com",
        "logo": "https://bcsratnaaward.com/assets/BCS-Website-Logo.png",
        "description": "India's premier Broadcasting, Cable & Satellite industry award by Aavishkar Media Group.",
        "foundingDate": "2010",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "B-263, Indra Nagar, Adarsh Nagar",
          "addressLocality": "New Delhi",
          "postalCode": "110033",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9811120650",
          "contactType": "customer service",
          "email": "info@aavishkargroup.in"
        },
        "sameAs": []
      })
    }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Hero />
      <BannerImage />
      <About />
      <Gallery />
      <Categories />
      {/* <VIPs /> */}
      <Shorts />
      <Videos />
      <Chairman />
      <WhyUs />
      <Partners />
      <StatsBottom />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex items-center justify-center pt-[72px] pb-8 md:min-h-screen md:pb-0" style={{ overflow: "hidden", minHeight: "calc(100svh)" }}>
      <AmbientBackground />

      {/* Trophy LEFT — hidden on mobile */}
      <div className="hidden md:flex hero-trophy-wrap" style={{
        position: "absolute",
        left: "3%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        pointerEvents: "none",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img
          src={trophyPng}
          alt="trophy"
          style={{
            height: "680px",
            width: "auto",
            objectFit: "contain",
            opacity: 0.65,
            display: "block",
            transformOrigin: "center bottom",
            animation: "trophySwayLeft 4.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Trophy RIGHT — hidden on mobile */}
      <div className="hidden md:flex hero-trophy-wrap" style={{
        position: "absolute",
        right: "3%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        pointerEvents: "none",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img
          src={trophyPng}
          alt="trophy"
          style={{
            height: "680px",
            width: "auto",
            objectFit: "contain",
            opacity: 0.75,
            display: "block",
            transformOrigin: "center bottom",
            animation: "trophySway 4s ease-in-out infinite",
          }}
        />
      </div>

      <div className="hero-content max-w-5xl mx-auto px-5 text-center relative z-10 py-8 md:py-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block font-cinzel text-[10px] sm:text-xs text-[#C9A84C] border border-[#C9A84C]/40 rounded-full px-3 py-1.5 mb-5 sm:mb-8">
            🏆 Since 2010 · India's Premier Media Award
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display font-black text-4xl sm:text-7xl lg:text-8xl text-gold-gradient leading-[1.05] tracking-tight"
        >
          BCS RATNA<br/>AWARD
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-display italic text-base sm:text-2xl text-white/85 mt-4 sm:mt-6 max-w-3xl mx-auto leading-snug"
        >
          Celebrating Excellence in Broadcasting,<br className="sm:hidden" /> Digital Media &amp; Technology
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 sm:mt-12"
        >
          <p className="font-cinzel text-[10px] sm:text-xs text-[#C9A84C] mb-2 sm:mb-3">The 12th Edition · BCS Ratna Award 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-5 sm:mt-12 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/categories" className="btn-outline-gold text-sm px-6 py-3">Explore Categories</Link>
        </motion.div>
      </div>
    </section>
  );
}

function BannerImage() {
  return (
    <section className="hidden sm:block py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
         <div className="block overflow-hidden rounded-xl sm:rounded-[1.5rem] shadow-[0_22px_70px_rgba(0,0,0,0.45)]">
          <img
            src="/assets/banner.jpeg"
            alt="BCS Ratna Award banner"
            className="w-full h-auto object-contain block"
            loading="eager"
          />
         </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { num: "14+", label: "Years of Excellence" },
    { num: "500+", label: "Awards Given" },
    { num: "200+", label: "Industry Partners" },
    { num: "50+", label: "Award Categories" },
  ];
  return (
    <section className="py-16 border-y border-[#C9A84C]/20 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-4xl md:text-6xl text-gold-gradient font-bold">{s.num}</div>
            <div className="font-cinzel text-[11px] text-white/60 mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-3 bg-gold-gradient opacity-50 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden border-2 border-[#C9A84C]/60 bg-black">
            <img
              src="/assets/bcs photo.webp"
              alt="BCS Ratna Award"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div>
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">About Us</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            India's Most <span className="text-gold-gradient italic">Celebrated</span><br/>Media Industry Award
          </h2>
          <div className="gold-divider !mx-0" />
          <p className="text-white/70 mt-6 leading-relaxed">
            The BCS Ratna Awards are bestowed annually by Aavishkar Media Group, recognising outstanding
            contributions in Broadcasting, Digital Media, Content, Distribution, Technology, DTH &amp; CATV
            industry. Since 2010, it has become the most awaited evening in India's B&amp;CS calendar — where
            leaders, innovators and storytellers gather to honour the year's defining work.
          </p>
          <div className="mt-8">
            <Link to="/about" className="btn-outline-gold">Read Our Story <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="py-12 md:py-20 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="Honours" title="Award |Categories|" subtitle="Six pillars of recognition across India's broadcasting and digital ecosystem." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/categories"
              className="glass-card p-8 group hover:border-[#C9A84C]/70 transition-all duration-500 hover:-translate-y-1 block no-underline"
            >
              <div className="w-14 h-14 rounded-full border border-[#C9A84C]/40 flex items-center justify-center mb-6 group-hover:bg-[#C9A84C] transition-all">
                <c.icon size={24} className="text-[#C9A84C] group-hover:text-black transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-white">{c.name}</h3>
              <p className="text-sm text-white/60 mt-3 leading-relaxed">{c.description}</p>
              <div className="mt-4 pt-4 border-t border-[#C9A84C]/15 flex items-center justify-between">
                <span className="text-[#C9A84C] text-xs font-cinzel">{c.subcategories.length} categories</span>
                <span className="text-[#C9A84C] text-xs">View Categories →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const galleryRoot = "/assets/top%20glimpses/";
  const images = [
    { year: "2013", src: `${galleryRoot}IMG_2160.JPG.jpeg` },
    { year: "2014", src: `${galleryRoot}IMG_2231.JPG.jpeg` },
    { year: "2015", src: `${galleryRoot}IMG_2335.JPG.jpeg` },
    { year: "2016", src: `${galleryRoot}IMG_2389.JPG.jpeg` },
    { year: "2017", src: `${galleryRoot}IMG_2436.JPG.jpeg` },
    { year: "2018", src: `${galleryRoot}IMG_2484.JPG.jpeg` },
    { year: "2019", src: `${galleryRoot}IMG_2584.JPG.jpeg` },
    { year: "2020", src: `${galleryRoot}Zee Action.JPG.jpeg` },
    { year: "2021", src: `${galleryRoot}_MG_2191.JPG.jpeg` },
    { year: "2022", src: `${galleryRoot}_MG_2259.JPG.jpeg` },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Avinnash-pandey.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Best-election-Coverage-NDTV.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Decode-with-Sudhir-Chaudhary.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/GTC-punjabi.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/GTPL-infinity.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Play-box-tv.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Playbox-TV.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/SALAAM-TV.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/sanskar-tv.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Sports-magic-den.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Sports-Magic-Hathway.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Star-sports-campaign-during-tata-ipl.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Syed-Suhail.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Times-Now-NavBharat.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Times-now.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Unite-8-Sports.png" },
    { year: "2026", src: "/assets/Past%20event%20images/award2026/Wheel-of-fortune-set.png" },
  ];
  const latestPhotos = images.filter((item) => item.year === "2026");
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [latestIndex, setLatestIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (openIndex === null) return;
    if (e.key === "ArrowRight") setOpenIndex((openIndex + 1) % images.length);
    if (e.key === "ArrowLeft") setOpenIndex((openIndex - 1 + images.length) % images.length);
    if (e.key === "Escape") setOpenIndex(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLatestIndex((current) => (current + 1) % latestPhotos.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [latestPhotos.length]);

  const openLatestPhoto = (index: number) => {
    const photo = latestPhotos[index];
    setLatestIndex(index);
    setOpenIndex(images.findIndex((item) => item.src === photo.src));
  };

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">MEMORIES</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3">
            Award Ceremony <span className="text-white">Glimpses</span>
          </h2>
          <div className="gold-divider" />
          <p className="text-white/70 mt-6 max-w-2xl mx-auto">
            A decade and more of red carpets, standing ovations and unforgettable nights.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-5xl">
          <div className="relative overflow-hidden rounded-xl border border-[#C9A84C]/35 bg-[#080808] shadow-[0_18px_50px_rgba(0,0,0,0.4)]" style={{ height: "min(68vw, 520px)" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.button
                key={latestPhotos[latestIndex].src}
                type="button"
                initial={{ opacity: 0, y: 45 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -45 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                onClick={() => openLatestPhoto(latestIndex)}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
                aria-label={`Open Award Ceremony 2026 photo ${latestIndex + 1}`}
              >
                <img
                  src={latestPhotos[latestIndex].src}
                  alt={`Award Ceremony 2026 photo ${latestIndex + 1}`}
                  className="h-full w-full object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-14 text-left">
                  <div>
                    <p className="font-cinzel text-[10px] tracking-[0.25em] text-[#C9A84C]">LATEST EDITION</p>
                    <p className="font-display text-2xl font-bold text-white">Award Ceremony 2026</p>
                  </div>
                  <span className="font-cinzel text-[10px] text-white/60">{latestIndex + 1} / {latestPhotos.length}</span>
                </div>
              </motion.button>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => openLatestPhoto((latestIndex - 1 + latestPhotos.length) % latestPhotos.length)}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-black"
              aria-label="Previous Award Ceremony 2026 photo"
            >
              <ChevronUp size={20} />
            </button>
            <button
              type="button"
              onClick={() => openLatestPhoto((latestIndex + 1) % latestPhotos.length)}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-black"
              aria-label="Next Award Ceremony 2026 photo"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {images.filter((item) => item.year !== "2026").map((item, i) => (
            <button
              key={i}
              onClick={() => setOpenIndex(i)}
              className="relative overflow-hidden rounded-lg group transition-all duration-300 hover:translate-y-[-4px] aspect-[4/3]"
              style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.4)" }}
            >
              <img
                src={item.src}
                alt={`Award Ceremony ${item.year}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 border border-[#C9A84C]/30 group-hover:border-[#C9A84C] transition-colors duration-300 rounded-lg" />
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={openIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[openIndex].src}
              alt={`Gallery ${images[openIndex].year}`}
              className="w-full max-h-[85vh] object-contain border-2 border-[#C9A84C] rounded-lg"
            />





            <button
              onClick={() => setOpenIndex((openIndex - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-black text-[#C9A84C] transition-all flex items-center justify-center text-2xl"
            >
              ←
            </button>

            <button
              onClick={() => setOpenIndex((openIndex + 1) % images.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-black text-[#C9A84C] transition-all flex items-center justify-center text-2xl"
            >
              →
            </button>

            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#C9A84C] hover:bg-white text-black hover:text-[#C9A84C] transition-all flex items-center justify-center text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Award, title: "Credibility", text: "14 years of unbiased jury evaluation." },
    { icon: Globe, title: "Reach", text: "Covered by 100+ national media outlets." },
    { icon: Handshake, title: "Networking", text: "Connect with India's top media executives." },
    { icon: TrendingUp, title: "Visibility", text: "National recognition for your brand." },
  ];
  return (
    <section className="py-12 md:py-20 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="The Difference" title="Why |BCS Ratna|" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.title} className="glass-card p-8 text-center hover:-translate-y-1 transition">
              <it.icon size={36} className="text-[#C9A84C] mx-auto" />
              <h3 className="font-display text-xl font-semibold mt-5">{it.title}</h3>
              <p className="text-sm text-white/60 mt-3 leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Shorts() {
  const shorts = [
    "qqFRxeKV978",
    "ebYF3pvRN-w",
    "wXJ-IneTYVw",
    "Fa1mbgroie4",
    "XtcA9udTyts",
  ];
  const [shortIndex, setShortIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 768) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setShortIndex((current) => (current + 1) % shorts.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [shorts.length]);

  const visibleShorts = Array.from({ length: visibleCount }, (_, offset) =>
    shorts[(shortIndex + offset) % shorts.length]
  );

  return (
    <section className="border-y border-[#C9A84C]/15 bg-[#0a0a0a] py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-12">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">QUICK MOMENTS</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient">
            Short <span className="text-white">Reels</span>
          </h2>
          <div className="gold-divider" />
          <p className="text-white/60 mt-4 text-sm md:text-base">A closer look at the moments behind BCS Ratna.</p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${shortIndex}-${visibleCount}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {visibleShorts.map((id) => (
              <a
                key={id}
                href={`https://youtube.com/shorts/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[9/14] overflow-hidden rounded-xl border border-[#C9A84C]/25 bg-black shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
                aria-label="Watch BCS Ratna Award short reel"
              >
                <img
                  src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                  alt="BCS Ratna Award short reel"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A84C] text-black shadow-[0_0_25px_rgba(201,168,76,0.45)] transition-transform duration-300 group-hover:scale-110">
                    <Play size={22} fill="currentColor" className="ml-1" />
                  </span>
                </div>
                <span className="absolute bottom-4 left-4 font-cinzel text-[10px] tracking-[0.2em] text-white/85">WATCH SHORT</span>
              </a>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          <a
            href="https://www.youtube.com/@AavishkarMediaGroup/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold inline-flex items-center gap-2"
          >
            View All Shorts <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Videos() {
  const vids = [
    "jQrUhMAXnyI",
    "BAn-HcBsjMQ",
    "xrOWzsDqQe4",
    "a1KetIorPgk",
    "UV7fBCAk8lM",
    "W2PA5aFb1bY",
  ];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="On Screen" title="Video |Gallery|" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vids.map((id) => (
            <button key={id} onClick={() => setOpen(id)} className="relative aspect-video overflow-hidden border border-[#C9A84C]/30 group">
              <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center group-hover:scale-110 transition">
                  <Play size={22} className="text-black ml-1" fill="currentColor" />
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="https://www.youtube.com/@AavishkarMediaGroup"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            View Channel
          </a>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6" onClick={() => setOpen(null)}>
          <div className="w-full max-w-5xl aspect-video">
            <iframe src={`https://www.youtube.com/embed/${open}?autoplay=1`} className="w-full h-full border border-[#C9A84C]/40" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        </div>
      )}
    </section>
  );
}

function Chairman() {
  return (
    <section className="py-12 md:py-20 bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C9A84C]/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionTitle eyebrow="Leadership" title="Chairman's |Message|" />
        <div className="glass-card p-10 md:p-14 grid md:grid-cols-3 gap-10 items-start">

          {/* Photo */}
          <div className="relative flex flex-col items-center text-center">
            <div className="absolute -inset-2 bg-gold-gradient opacity-30 blur-xl rounded-xl" />
            <img
              src="/assets/DR SIR PIC.png"
              alt="Chairman — Aavishkar Media Group"
              className="relative w-full max-w-[280px] mx-auto object-cover object-top border-2 border-[#C9A84C]/60 rounded-xl"
              style={{ aspectRatio: "3/4" }}
            />
            <div className="mt-5 relative">
              <p className="font-display text-2xl text-gold-gradient font-bold">Dr. A.K. Rastogi</p>
              <p className="font-cinzel text-sm text-white/70 mt-1.5 tracking-wider">Founder-Chairman & Editor in Chief</p>
            </div>
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <svg width="48" height="36" viewBox="0 0 48 36" fill="none" className="mb-6 opacity-60">
              <path d="M0 36V22.5C0 15.9 1.8 10.5 5.4 6.3C9 2.1 13.8 0 19.8 0L21.6 3.6C17.4 4.8 14.1 7.2 11.7 10.8C9.3 14.4 8.1 18.3 8.1 22.5H18V36H0ZM27 36V22.5C27 15.9 28.8 10.5 32.4 6.3C36 2.1 40.8 0 46.8 0L48 3.6C43.8 4.8 40.5 7.2 38.1 10.8C35.7 14.4 34.5 18.3 34.5 22.5H44.1V36H27Z" fill="#C9A84C"/>
            </svg>

            <div className="space-y-4 text-white/80 leading-relaxed text-[15px]">
              <p>
                I can't express my ecstatic feelings while sharing it with you that the journey of the BCS Ratna Awards is completing one decade of praises and recognitions. It gives me great pleasure to formally offer you the opportunity to be a part of <span className="text-[#C9A84C] font-semibold">12th edition</span> of these esteemed awards.
              </p>
              <p>
                Year-by-year, since its inception in <span className="text-[#C9A84C] font-semibold">2010</span>, these Awards have become a symbol of excellence in the fields of Broadcasting, Media, Digital Content, OTT, ISPs, IPTV, CATV, DTH, Distribution & Hardware & Software industry — setting a very high standard of benchmark in the entire Indian B&CS industry.
              </p>
              <p>
                The BCS Ratna Awards provide a great opportunity for the partners to align their organisation and to develop a strong relationship with the industry stakeholders. The award nominees will be selected, shortlisted and judged by our industry people in an independent manner because these are the industry's own awards of their kind in the entire India.
              </p>
              <p>
                The <span className="text-[#C9A84C] font-semibold">12th edition of BCS RATNA AWARDS</span> is going to be held in <span className="text-[#C9A84C] font-semibold">July–August 2026, New Delhi</span>. The BCS RATNA Awards are the biggest night in the entire Indian Broadcasting & CATV industry, attended by hundreds of Broadcasting VIPs, industry stalwarts, key officials from various ministries and all other stakeholders associated with this industry.
              </p>
              <p>
                So it is a great chance for you to meet new clients, catch up with old ones and celebrate with the industry heavyweights.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#C9A84C]/20">
              <p className="font-display italic text-[#C9A84C] text-lg">
                "As the Chairman of Aavishkar Media Group, I cordially invite you to the 12th BCS RATNA Awards Ceremony & Gala Evening."
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function VIPs() {
  const vips = [
    { name: "Sh. Anurag Thakur", title: "Former I&B Minister", org: "Government of India", since: "2018" },
    { name: "Mr. Punit Goenka", title: "CEO", org: "Zee Entertainment", since: "2012" },
    { name: "Mr. Sunil Lulla", title: "MD & CEO", org: "Eros STX", since: "2014" },
    { name: "Ms. Shailja Kejriwal", title: "Chief Creative Officer", org: "Sony LIV", since: "2016" },
    { name: "Mr. Harit Nagpal", title: "MD & CEO", org: "Tata Play", since: "2013" },
    { name: "Mr. Saurabh Dhoot", title: "Chairman", org: "Videocon d2h", since: "2010" },
    { name: "Mr. Anil Malhotra", title: "Former Chairman", org: "TRAI", since: "2015" },
    { name: "Ms. Priya Nair", title: "VP Content", org: "JioStar", since: "2019" },
  ];
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-lg">◆</span>
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">Past Attendees</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient leading-tight">
            Industry Icons Who Graced BCS Ratna
          </h2>
          <div className="gold-divider" />
          <p className="text-white/60 max-w-2xl mx-auto mt-4 text-base leading-relaxed">
            Ministers, CEOs, and Media Veterans who have been part of our journey.
          </p>
        </div>
        <div className="flex md:grid gap-5 md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory">
          {vips.map((v) => (
            <div
              key={v.name}
              className="group relative bg-[#1A1A1A] rounded-2xl p-6 border border-[#C9A84C]/15 hover:border-[#C9A84C]/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_50px_rgba(201,168,76,0.25)] min-w-[260px] md:min-w-0 snap-center text-center"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-full bg-gold-gradient opacity-30 blur-md group-hover:opacity-60 transition" />
                <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-[3px] border-[#C9A84C] bg-[#0d0d0d] flex items-center justify-center">
                  <span className="font-display text-4xl text-gold-gradient font-bold">
                    {v.name.split(" ").slice(-2).map(w => w[0]).join("")}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-black text-sm">
                  ★
                </div>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-white leading-tight" style={{ fontFamily: '"Raleway", "DM Sans", sans-serif' }}>
                {v.name}
              </h3>
              <p className="text-[15px] text-[#C9A84C] mt-1.5">{v.title}</p>
              <p className="text-sm text-[#B0B0B0] mt-0.5">{v.org}</p>
              <span className="inline-block mt-4 px-3 py-1 rounded-full text-[10px] font-cinzel bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30">
                Since {v.since}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-white/55 text-sm mb-5">And 200+ more industry leaders across 14 years</p>
          <Link to="/events" className="btn-outline-gold">View All Past Attendees</Link>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const sponsors = [
    { src: "/assets/Sponsors/1. NDTV Logo (Black).png", alt: "NDTV" },
    { src: "/assets/Sponsors/3.png", alt: "Sponsor" },
    { src: "/assets/Sponsors/4.png", alt: "Sponsor" },
    { src: "/assets/Sponsors/5.png", alt: "Sponsor" },
    { src: "/assets/Sponsors/6.png", alt: "Sponsor" },
    { src: "/assets/Sponsors/Aavishkar Media Pvt Ltd.png", alt: "Aavishkar Media" },
    { src: "/assets/Sponsors/dangal.png", alt: "Dangal TV" },
    { src: "/assets/Sponsors/GTPL.png", alt: "GTPL" },
    { src: "/assets/Sponsors/JioStar_Service_logo_black.jpg", alt: "JioStar" },
    { src: "/assets/Sponsors/Kerala Vision Digital TV 2 - Copy.png", alt: "Kerala Vision" },
    { src: "/assets/Sponsors/khabar-fast.png", alt: "Khabar Fast" },
    { src: "/assets/Sponsors/ptc.png", alt: "PTC" },
    { src: "/assets/Sponsors/Sanskar.png", alt: "Sanskar TV" },
    { src: "/assets/Sponsors/WhatsApp Image 2025-07-29 at 12.57.28 PM.jpeg", alt: "Sponsor" },
    { src: "/assets/Sponsors/Z-Brandmark-Charcoal.png", alt: "Zee" },
  ];

  // Duplicate for seamless loop
  const loop = [...sponsors, ...sponsors];

  return (
    <section className="py-20 border-y border-[#C9A84C]/15 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient">OUR PREVIOUS SPONSORS</h2>
          <div className="gold-divider" />
          <p className="text-white/60 mt-4 text-base">Trusted by India's leading media and broadcast organisations.</p>
        </div>
      </div>

      {/* Auto-looping slider — no JS, pure CSS */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />

        <div className="sponsors-track flex gap-6 items-center">
          {loop.map((s, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center justify-center bg-white rounded-xl"
              style={{ width: "200px", height: "110px", padding: "16px 20px" }}
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBottom() {
  const stats = [
    { num: "14+", label: "Years of Excellence" },
    { num: "500+", label: "Awards Given" },
    { num: "200+", label: "Industry Partners" },
    { num: "50+", label: "Award Categories" },
  ];
  return (
    <section className="py-20 bg-[#080808] border-t border-[#C9A84C]/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className="group">
              <div
                className="font-display font-bold text-gold-gradient leading-none"
                style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
              >
                {s.num}
              </div>
              <div className="font-cinzel text-[11px] md:text-xs text-white/55 mt-3 tracking-widest uppercase">
                {s.label}
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-[#C9A84C]/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

