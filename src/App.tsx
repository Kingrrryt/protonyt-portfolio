import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";

gsap.registerPlugin(ScrollTrigger);

const HLS_SRC = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
const ROLES = ["Creative Developer", "Fullstack Engineer", "Cloud Architect", "System Builder"];
const LOADING_WORDS = ["Design", "Create", "Inspire"];

function useHlsVideo(videoRef: React.RefObject<HTMLVideoElement>, src: string) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [videoRef, src]);
}

// ---------- Loading Screen ----------
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 2700;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 100));
      if (progress < 1) raf = requestAnimationFrame(animate);
      else {
        setExiting(true);
        setTimeout(onComplete, 700);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % LOADING_WORDS.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 md:p-10 pointer-events-none"
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      {/* Top */}
      <div className="flex justify-between items-start">
        <span className="text-[11px] text-muted uppercase tracking-[0.3em] font-medium">PROTON</span>
        <span className="text-[11px] text-muted uppercase tracking-[0.3em] hidden md:block">©2026 — COLLECTION</span>
      </div>

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[60px] md:h-[90px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={wordIndex}
              initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="font-display italic text-5xl md:text-7xl lg:text-[88px] leading-none tracking-tight text-text-primary"
            >
              {LOADING_WORDS[wordIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between gap-6">
        <div className="flex-1 max-w-[320px]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Loading Experience</span>
            <span className="text-[10px] tracking-[0.2em] text-muted uppercase">{count}%</span>
          </div>
          <div className="h-[3px] w-full bg-stroke/50 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 accent-gradient rounded-full"
              style={{
                width: `${count}%`,
                boxShadow: "0 0 20px rgba(137,170,204,0.6), 0 0 40px rgba(78,133,191,0.3)",
              }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-[56px] md:text-[84px] leading-none tabular-nums tracking-tight text-text-primary">
            {String(count).padStart(3, "0")}
          </div>
          <div className="text-[10px] tracking-[0.3em] text-muted uppercase mt-1">Percent</div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Navbar ----------
function Navbar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[640px]"
    >
      <div
        className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-full border transition-all duration-500 ${
          scrolled ? "bg-surface/90 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" : "bg-surface/70 backdrop-blur-md border-white/10 shadow-md"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full p-[1.5px] accent-gradient group cursor-pointer">
            <div className="w-full h-full rounded-full bg-bg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="font-display italic font-bold text-[13px] tracking-tight">PR</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-bg/50 rounded-full p-1 border border-white/[0.06]">
            {["Home", "Work", "Resume"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActive(item);
                  if (item === "Home") window.scrollTo({ top: 0, behavior: "smooth" });
                  if (item === "Work") document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                  if (item === "Resume") window.open("https://read.cv", "_blank");
                }}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  active === item ? "bg-stroke/80 text-text-primary shadow-inner" : "text-muted hover:text-text-primary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Action */}
        <a
          href="mailto:hello@proton.dev"
          className="group relative flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-text-primary text-bg text-[13px] font-semibold overflow-hidden"
        >
          <span className="relative z-10">Say hi</span>
          <span className="relative z-10 w-6 h-6 rounded-full bg-bg text-text-primary flex items-center justify-center text-[12px] group-hover:rotate-45 transition-transform duration-300">↗</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient" />
          <span className="absolute inset-0 rounded-full p-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="block w-full h-full rounded-full accent-gradient" />
          </span>
        </a>
      </div>
    </motion.header>
  );
}

// ---------- Hero ----------
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);

  useHlsVideo(videoRef, HLS_SRC);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-eyebrow",
        { y: 20, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".hero-title-line",
        { y: 80, opacity: 0, filter: "blur(12px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.12, ease: "power4.out", delay: 0.4 }
      );
      gsap.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 1 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-bg">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-16 px-6 md:px-10 max-w-[1600px] mx-auto w-full">
        <div className="max-w-4xl">
          <div className="hero-eyebrow inline-flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-text-primary/40" />
            <span className="text-[11px] tracking-[0.3em] text-text-primary/70 uppercase font-medium">COLLECTION '26</span>
            <span className="w-2 h-2 rounded-full accent-gradient animate-pulse" />
          </div>

          <h1 ref={headingRef} className="font-display text-[13vw] md:text-[9vw] lg:text-[112px] leading-[0.85] tracking-[-0.04em] text-text-primary mb-6">
            <span className="hero-title-line block overflow-hidden">
              <span className="block">Proton</span>
            </span>
            <span className="hero-title-line block overflow-hidden -mt-2 md:-mt-4">
              <span className="block italic font-light tracking-[-0.03em]">Studio</span>
            </span>
          </h1>

          <div className="flex flex-wrap items-baseline gap-3 mb-6 hero-title-line">
            <span className="text-[18px] md:text-[22px] text-text-primary/90 font-light">A</span>
            <span className="relative inline-block min-w-[220px] md:min-w-[280px] h-[28px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIdx}
                  initial={{ y: 20, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 font-display italic text-[18px] md:text-[22px] text-text-primary accent-gradient-text"
                >
                  {ROLES[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-[18px] md:text-[22px] text-text-primary/90 font-light">lives in Delhi.</span>
          </div>

          <p ref={subRef} className="hero-title-line max-w-[560px] text-[15px] md:text-[17px] leading-[1.6] text-muted font-light mb-10">
            Designing seamless digital interactions and high-performance cloud architectures by focusing on the unique nuances which bring systems to life.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="hero-cta group relative px-7 py-[14px] rounded-full bg-text-primary text-bg text-[14px] font-semibold flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">See Works</span>
              <span className="relative z-10 w-5 h-5 rounded-full bg-bg text-text-primary flex items-center justify-center text-[10px] group-hover:translate-x-0.5 transition-transform">↗</span>
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 accent-gradient transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            </a>
            <a
              href="mailto:hello@proton.dev"
              className="hero-cta group relative px-7 py-[14px] rounded-full border border-white/15 bg-white/[0.04] backdrop-blur text-text-primary text-[14px] font-medium hover:border-white/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                Reach out...
                <span className="opacity-60 group-hover:opacity-100 transition-opacity">✦</span>
              </span>
              <span className="absolute inset-0 rounded-full p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="block w-full h-full rounded-full accent-gradient opacity-30" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-6 md:right-10 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[0.3em] text-muted uppercase rotate-90 origin-center translate-y-6">Scroll</span>
        <div className="w-[1px] h-14 bg-stroke/60 overflow-hidden relative">
          <div className="absolute inset-0 w-full h-1/2 bg-text-primary animate-[scroll-down_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-soft-light" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </section>
  );
}

// ---------- Works ----------
const PROJECTS = [
  {
    title: "Cloud Infrastructure",
    category: "System Architecture • 2025",
    desc: "Scalable multi-region deployment with edge caching and zero-downtime rollouts.",
    span: "md:col-span-7",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    accent: "from-[#89AACC]/20 to-[#4E85BF]/20",
  },
  {
    title: "Neural Dashboard",
    category: "AI Interface • 2025",
    desc: "Real-time inference visualization for large language models.",
    span: "md:col-span-5",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    accent: "from-violet-500/10 to-blue-500/10",
  },
  {
    title: "Automated Pipelines",
    category: "DevOps • 2024",
    desc: "CI/CD orchestration reducing deploy time by 73% across microservices.",
    span: "md:col-span-5",
    img: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070&auto=format&fit=crop",
    accent: "from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "Spatial UI",
    category: "Interaction • 2024",
    desc: "3D spatial computing interface with gesture-driven navigation.",
    span: "md:col-span-7",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
    accent: "from-orange-500/10 to-pink-500/10",
  },
];

function Works() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-card",
        { y: 60, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={ref} className="relative bg-bg px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-muted" />
              <span className="text-[11px] tracking-[0.3em] text-muted uppercase">Selected Works — 2024/26</span>
            </div>
            <h2 className="font-display text-[42px] md:text-[64px] leading-[0.9] tracking-[-0.03em]">
              Featured <span className="italic font-light accent-gradient-text">projects</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-[14px] leading-[1.6] text-muted">A curated collection of systems built for scale, speed, and seamless interaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              className={`work-card group relative rounded-[24px] md:rounded-[28px] overflow-hidden bg-surface border border-white/[0.06] ${p.span} min-h-[420px] md:min-h-[520px]`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] as any }}
            >
              <div className="absolute inset-0">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out" />
                <div className={`absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent opacity-90`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60 mix-blend-overlay`} />
                <div className="absolute inset-0 halftone opacity-[0.15] group-hover:opacity-[0.25] transition-opacity" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-8">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] tracking-wide text-text-primary/80">{p.category}</span>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="w-10 h-10 rounded-full bg-text-primary text-bg flex items-center justify-center text-[14px] opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    ↗
                  </motion.div>
                </div>

                <div>
                  <h3 className="font-display text-[28px] md:text-[36px] leading-[0.95] tracking-tight mb-3">{p.title}</h3>
                  <p className="text-[13px] leading-[1.5] text-white/60 max-w-[320px] mb-5">{p.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[12px] font-medium group-hover:bg-text-primary group-hover:text-bg transition-colors">View case ↗</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px] accent-gradient pointer-events-none">
                <div className="w-full h-full rounded-[inherit] bg-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Journal ----------
const JOURNALS = [
  { title: "Building zero-latency edge functions", date: "Dec 12 • 2025", read: "6 min", tag: "Engineering", img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070" },
  { title: "The anatomy of a design system that scales", date: "Nov 28 • 2025", read: "8 min", tag: "Design", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2068" },
  { title: "Why we moved from microservices to modular monolith", date: "Nov 03 • 2025", read: "5 min", tag: "Architecture", img: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=2074" },
  { title: "Optimizing LCP under 1.2s for 3D web", date: "Oct 19 • 2025", read: "4 min", tag: "Performance", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070" },
];

function Journal() {
  return (
    <section className="relative bg-bg border-y border-stroke/50 px-6 md:px-10 py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-display text-[24px] md:text-[32px] tracking-tight">Journal & <span className="italic font-light">Thoughts</span></h3>
          <a href="#" className="text-[13px] text-muted hover:text-text-primary transition-colors">View all — 24 articles</a>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory">
          {JOURNALS.map((j, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="snap-start shrink-0 group flex items-center gap-4 pl-2 pr-6 py-2 rounded-full bg-surface border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                <img src={j.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[13px] font-medium leading-tight whitespace-nowrap max-w-[260px] truncate">{j.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                    <span>{j.date}</span><span>•</span><span>{j.read}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] tracking-wide uppercase">{j.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Explorations (Parallax) ----------
function Explorations() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin header
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: headerRef.current,
        pinSpacing: false,
      });

      // Parallax columns
      gsap.to(col1Ref.current, {
        y: -400,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to(col2Ref.current, {
        y: -650,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
      gsap.to(col3Ref.current, {
        y: -300,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const cards = [
    { img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", h: "h-[320px]", title: "Neumorphic UI" },
    { img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800", h: "h-[420px]", title: "Glass Layers" },
    { img: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800", h: "h-[280px]", title: "Fluid Motion" },
    { img: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=800", h: "h-[380px]", title: "Depth Study" },
    { img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", h: "h-[360px]", title: "Chrome Type" },
    { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", h: "h-[300px]", title: "Data Sculpt" },
  ];

  return (
    <section ref={sectionRef} className="relative bg-bg min-h-[300vh]">
      <div ref={headerRef} className="h-screen flex items-center justify-center pointer-events-none z-10">
        <div className="text-center px-6">
          <span className="text-[11px] tracking-[0.3em] text-muted uppercase">Explorations — 2023/26</span>
          <h2 className="font-display text-[18vw] md:text-[12vw] leading-[0.8] tracking-[-0.05em] mt-4">
            Visual <span className="italic font-light accent-gradient-text">playground</span>
          </h2>
          <p className="mt-6 text-muted text-[14px] max-w-[360px] mx-auto">Scroll-driven experiments in motion, light, and spatial interfaces.</p>
        </div>
      </div>

      <div className="absolute inset-0 top-[20vh] grid grid-cols-12 gap-4 px-6 md:px-10 max-w-[1600px] mx-auto w-full">
        <div ref={col1Ref} className="col-span-4 flex flex-col gap-4 pt-[40vh]">
          {[cards[0], cards[3]].map((c, i) => (
            <div key={i} className={`relative rounded-[20px] overflow-hidden bg-surface border border-white/5 ${c.h}`}>
              <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white">{c.title}</span>
            </div>
          ))}
        </div>
        <div ref={col2Ref} className="col-span-4 flex flex-col gap-4 pt-[10vh]">
          {[cards[1], cards[4]].map((c, i) => (
            <div key={i} className={`relative rounded-[20px] overflow-hidden bg-surface border border-white/5 ${c.h}`}>
              <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white">{c.title}</span>
            </div>
          ))}
        </div>
        <div ref={col3Ref} className="col-span-4 flex flex-col gap-4 pt-[60vh]">
          {[cards[2], cards[5]].map((c, i) => (
            <div key={i} className={`relative rounded-[20px] overflow-hidden bg-surface border border-white/5 ${c.h}`}>
              <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white">{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Stats ----------
function Stats() {
  return (
    <section className="relative bg-bg border-y border-stroke/50 px-6 md:px-10 py-20 md:py-28">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stroke/50">
        {[
          { k: "20+", v: "Cloud Deployments", d: "Across AWS, GCP & edge networks with 99.99% uptime" },
          { k: "95+", v: "Projects Scaled", d: "From MVP to enterprise handling millions of requests" },
          { k: "200%", v: "Performance Boost", d: "Average improvement in core web vitals & latency" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="py-10 md:py-0 md:px-12 first:pl-0 last:pr-0"
          >
            <div className="font-display text-[56px] md:text-[72px] leading-none tracking-tight">
              {s.k}
            </div>
            <div className="mt-4 text-[16px] font-medium text-text-primary">{s.v}</div>
            <div className="mt-2 text-[13px] leading-[1.5] text-muted max-w-[300px]">{s.d}</div>
            <div className="mt-6 w-full h-[2px] bg-stroke/50 relative overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 origin-left accent-gradient"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------- Contact & Footer ----------
function Contact() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  useHlsVideo(videoRef, HLS_SRC);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-bg overflow-hidden">
      {/* Flipped video background */}
      <div className="absolute inset-0">
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover scale-y-[-1]" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      {/* Marquee */}
      <div className="relative z-10 border-y border-white/10 bg-surface/50 backdrop-blur-md overflow-hidden py-4">
        <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-8 font-display text-[20px] md:text-[24px] tracking-tight">
              BUILDING THE FUTURE <span className="w-2 h-2 rounded-full accent-gradient" /> CRAFTING SYSTEMS <span className="w-2 h-2 rounded-full accent-gradient" />{" "}
            </span>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={`dup-${i}`} className="flex items-center gap-8 px-8 font-display text-[20px] md:text-[24px] tracking-tight">
              BUILDING THE FUTURE <span className="w-2 h-2 rounded-full accent-gradient" /> CRAFTING SYSTEMS <span className="w-2 h-2 rounded-full accent-gradient" />{" "}
            </span>
          ))}
        </div>
      </div>

      {/* Big CTA */}
      <div className="relative z-10 px-6 md:px-10 py-24 md:py-32 max-w-[1600px] mx-auto">
        <div className="max-w-4xl">
          <span className="text-[11px] tracking-[0.3em] text-white/50 uppercase">Let's build something — Available now</span>
          <h2 className="font-display text-[12vw] md:text-[92px] leading-[0.85] tracking-[-0.04em] mt-6 mb-12">
            Let's make <br />
            <span className="italic font-light">it happen</span>
          </h2>

          <a
            href="mailto:hello@proton.dev"
            className="group relative inline-flex items-center gap-6 pl-8 pr-2 py-2 rounded-full bg-text-primary text-bg"
          >
            <span className="font-display text-[20px] md:text-[28px] tracking-tight">hello@proton.dev</span>
            <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-bg text-text-primary flex items-center justify-center text-xl group-hover:rotate-45 transition-transform duration-500">↗</span>
            <div className="absolute -inset-[1px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity blur-[8px] -z-10" />
          </a>

          <div className="mt-16 flex flex-wrap gap-3">
            {[
              { label: "GitHub", href: "https://github.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
              { label: "Twitter", href: "https://twitter.com" },
              { label: "Discord", href: "https://discord.com" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-[13px] hover:bg-white hover:text-black transition-colors"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 border-t border-white/10 px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 text-[12px] text-white/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span>Available for engineering projects • Delhi, IN — {new Date().toLocaleTimeString()} IST</span>
        </div>
        <div className="text-[11px] tracking-wide text-white/40 uppercase">©2026 PROTON Studio — All systems operational</div>
      </div>
    </section>
  );
}

// ---------- App ----------
export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div className="bg-bg text-text-primary selection:bg-[#89AACC] selection:text-black">
      <AnimatePresence>{loading && <LoadingScreen onComplete={() => setLoading(false)} />}</AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
        <Navbar />
        <Hero />
        <Works />
        <Journal />
        <Explorations />
        <Stats />
        <Contact />

        {/* Reveal overlay after loading for extra polish */}
        {ready && (
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="fixed inset-0 z-[60] bg-bg origin-top pointer-events-none"
          />
        )}
      </motion.div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
