import { useRef } from "react";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import Reveal from "@/components/Reveal";

const Stats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="stats" ref={ref} className="border-y border-white/5 bg-[#070707] py-20" data-testid="stats-section">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 text-center md:grid-cols-3">
        <Reveal testId="stat-websites">
          <p className="font-display text-6xl font-black hp-gradient-text sm:text-7xl" data-testid="stat-websites-number">
            {inView ? <CountUp start={0} end={200} duration={2.4} suffix="+" /> : "0"}{" "}
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-400">Websites Built</p>
        </Reveal>
        <Reveal delay={0.15} testId="stat-coverage">
          <p className="font-display text-6xl font-black text-white sm:text-7xl">AU</p>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-400">Australia-Wide · Fully Remote</p>
        </Reveal>
        <Reveal delay={0.3} testId="stat-services">
          <p className="font-display text-6xl font-black text-white sm:text-7xl">5</p>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-400">Core Services, One Studio</p>
        </Reveal>
      </div>
    </section>
  );
};

export default Stats;
