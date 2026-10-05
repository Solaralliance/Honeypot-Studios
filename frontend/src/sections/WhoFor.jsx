import { Globe, RefreshCw, Database, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ShimmerCard from "@/components/ShimmerCard";
import { track } from "@/lib/analytics";
import GradientText from "@/components/GradientText";

export const prefillService = (service) => {
  window.dispatchEvent(new CustomEvent("hp:prefill-service", { detail: service }));
};

const PATHS = [
  {
    icon: Globe,
    title: "I don't have a website yet",
    service: "landing-page",
    testId: "who-new-website",
    body: "Customers are Googling you right now and finding nothing — or worse, a competitor. We get you online properly: fast, findable, and built to bring enquiries from day one.",
    cta: "Start from $548",
  },
  {
    icon: RefreshCw,
    title: "My website needs a revamp",
    service: "website-revamp",
    testId: "who-revamp",
    body: "Slow load times, dated design, no enquiries? A revamp keeps what works, fixes what doesn't and rebuilds the rest on modern infrastructure you own.",
    cta: "Revamps from $399",
  },
  {
    icon: Database,
    title: "I'm a marketing pro who needs a CRM",
    service: "crm-web-app",
    testId: "who-crm",
    body: "Off-the-shelf CRMs charge per seat for features you'll never touch. We build lean custom CRMs and client portals around your exact pipeline — leads, jobs, reporting.",
    cta: "Custom CRMs from $1,999",
  },
];

const WhoFor = () => (
  <section id="who" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24" data-testid="who-section">
    <Reveal as="h2" testId="who-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
      Built for <GradientText>where you're at</GradientText>
    </Reveal>
    <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
      Three kinds of people land on this page. Pick yours — the form at the
      bottom will already know what you need.
    </Reveal>

    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      {PATHS.map((path) => (
        <ShimmerCard key={path.title} testId={path.testId} className="flex flex-col p-8">
          <path.icon className="h-9 w-9 text-cyan-400" aria-hidden="true" />
          <h3 className="mt-5 font-display text-lg font-bold leading-snug">{path.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{path.body}</p>
          <a
            href="#contact"
            onClick={() => {
              prefillService(path.service);
              track("cta_click", { label: path.testId });
            }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-400 transition-colors hover:text-cyan-300"
            data-testid={`${path.testId}-cta`}
          >
            {path.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </ShimmerCard>
      ))}
    </div>
  </section>
);

export default WhoFor;
