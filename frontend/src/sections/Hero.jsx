import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import NeonButton from "@/components/NeonButton";
import GradientText from "@/components/GradientText";

const HERO_BG = "https://customer-assets-eiarnc6j.emergentagent.net/job_8a876f68-14ba-49e3-84f0-dfe2beb700a7/artifacts/ns4ihd3m_IMG_3229.jpeg";

const Hexagon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
    <path d="M50 4 91 27v46L50 96 9 73V27z" stroke="currentColor" strokeWidth="2" />
    <path d="M50 26 71 38v24L50 74 29 62V38z" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const Hero = () => (
  <section
    className="hp-hex-grid relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-16"
    data-testid="hero-section"
  >
    {/* ambient glows */}
    <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[120px]" aria-hidden="true" />
    <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" aria-hidden="true" />

    {/* floating vector hexagons */}
    <Hexagon className="hp-float pointer-events-none absolute left-[8%] top-[22%] h-16 w-16 text-fuchsia-500/50" />
    <Hexagon className="hp-float-slow pointer-events-none absolute right-[10%] top-[30%] h-24 w-24 text-cyan-400/40" />
    <Hexagon className="hp-float pointer-events-none absolute bottom-[18%] left-[16%] h-10 w-10 text-purple-500/50" />

    <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
      <motion.p
        className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        HoneyPot — our website design studio
      </motion.p>

      <motion.h1
        className="mt-6 font-display text-5xl font-black leading-[1.15] tracking-tighter sm:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        WE BUILD
        <br />
        <GradientText className="hp-glow-text">
          WEBSITES THAT WORK
        </GradientText>
      </motion.h1>

      <motion.p
        className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        200+ websites built for tradies, small businesses and startups across
        Australia. Landing pages, custom builds, CRMs, digital marketing and
        social media — everything your online presence needs, nothing it doesn't.
      </motion.p>

      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <NeonButton href="#work" testId="hero-cta-see-work" trackLabel="hero-see-work">
          See Our Work
        </NeonButton>
        <NeonButton href="#contact" testId="hero-cta-start" trackLabel="hero-start-project">
          Let's Build Your Online Presence
        </NeonButton>
      </motion.div>

      <motion.div
        className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(138,43,226,0.25)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
      >
        <img
          src={HERO_BG}
          alt="HoneyPot Studio showcase banner — neon honeycomb globe between two glowing website wireframes, with landing pages, tradie websites and custom-made websites cards"
          className="h-auto w-full"
          width={2048}
          height={768}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </motion.div>
    </div>

    <a
      href="#stats"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 transition-colors hover:text-cyan-400"
      aria-label="Scroll to stats"
      data-testid="hero-scroll-down"
    >
      <ChevronDown className="h-7 w-7 animate-bounce" />
    </a>
  </section>
);

export default Hero;
