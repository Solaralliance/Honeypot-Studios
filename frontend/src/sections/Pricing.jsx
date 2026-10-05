import { Check, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ShimmerCard from "@/components/ShimmerCard";
import NeonButton from "@/components/NeonButton";
import { track } from "@/lib/analytics";
import GradientText from "@/components/GradientText";

const PACKAGES = [
  {
    name: "Landing Page",
    price: "$548",
    unit: "one-off",
    testId: "pricing-landing",
    features: ["Single conversion-focused page", "Mobile-first, fast load", "Contact / lead form wired up", "SEO fundamentals & analytics"],
  },
  {
    name: "Tradie Website",
    price: "$1,048",
    unit: "one-off",
    testId: "pricing-tradie",
    featured: true,
    features: ["5–8 pages around your services", "Quote & booking forms", "Local SEO + Google Business ready", "Review and gallery sections"],
  },
  {
    name: "Custom Website / App",
    price: "$2,548",
    unit: "from, one-off",
    testId: "pricing-custom",
    features: ["Bespoke design around your brand", "E-commerce, bookings, CRMs, portals", "Integrations & automation", "You own the code and the accounts"],
  },
];

const ONGOING = [
  { name: "Digital Marketing", price: "$448/mo", desc: "SEO, Google Ads and GA4 reporting in plain English." },
  { name: "Social Media Management", price: "$498/mo", desc: "Calendar, creative, scheduling, replies and a monthly report." },
  { name: "Website Hosting & Care", price: "$29/mo", desc: "Hosting on your accounts, uptime monitoring, updates and small tweaks." },
];

const EXTRAS = [
  { name: "Website revamp / refresh", price: "from $399" },
  { name: "Extra page (any package)", price: "$99" },
  { name: "Logo design or refresh", price: "from $249" },
  { name: "Copywriting", price: "$149 / page" },
  { name: "SEO audit + fix", price: "$299" },
  { name: "Google Business Profile setup", price: "$149" },
  { name: "Blog / news section setup", price: "$199" },
  { name: "E-commerce add-on", price: "from $499" },
  { name: "CRM / web app build", price: "from $1,999" },
  { name: "Priority support", price: "$79/mo" },
];

const Pricing = () => (
  <section id="pricing" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24" data-testid="pricing-section">
    <Reveal as="h2" testId="pricing-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
      Pricing that <GradientText>doesn't hide</GradientText>
    </Reveal>
    <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
      Every price on the table, AUD, before you ever talk to us. Competitive
      against agencies charging triple for the same stack.
    </Reveal>

    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      {PACKAGES.map((pkg) => (
        <ShimmerCard
          key={pkg.name}
          testId={pkg.testId}
          className={`flex flex-col p-8 ${pkg.featured ? "ring-1 ring-fuchsia-500/50" : ""}`}
        >
          {pkg.featured && (
            <span className="mb-4 w-fit rounded-full bg-fuchsia-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300">
              Most popular
            </span>
          )}
          <h3 className="font-display text-lg font-bold">{pkg.name}</h3>
          <p className="mt-3">
            <GradientText className="font-display text-4xl font-black">{pkg.price}</GradientText>
            <span className="ml-2 text-xs uppercase tracking-wider text-zinc-500">{pkg.unit}</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <NeonButton href="#contact" testId={`${pkg.testId}-cta`} trackLabel={pkg.testId} className="w-full">
              Get Started
            </NeonButton>
          </div>
        </ShimmerCard>
      ))}
    </div>

    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
      {ONGOING.map((item) => (
        <Reveal
          key={item.name}
          testId={`ongoing-${item.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          className="rounded-xl border border-white/10 bg-white/[0.02] p-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-bold text-white">{item.name}</h3>
            <span className="font-display text-lg font-bold text-cyan-300">{item.price}</span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">{item.desc}</p>
        </Reveal>
      ))}
    </div>

    <Reveal testId="extras-list" className="mt-14" id="extras">
      <div id="extras" className="scroll-mt-28">
        <h3 className="font-display text-xl font-bold">
          Extras &amp; add-ons — <GradientText>competitive, itemised</GradientText>
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
          {EXTRAS.map((extra) => (
            <div
              key={extra.name}
              className="flex items-center justify-between border-b border-white/5 py-3"
              data-testid={`extra-${extra.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              <span className="flex items-center gap-2 text-sm text-zinc-300">
                <ArrowRight className="h-3.5 w-3.5 text-fuchsia-400" aria-hidden="true" />
                {extra.name}
              </span>
              <span className="text-sm font-semibold text-cyan-300">{extra.price}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-zinc-600">
          All prices AUD. Extras can be bolted onto any package or ordered on
          their own. No lock-in on monthly services — cancel with 30 days notice.
        </p>
      </div>
    </Reveal>
  </section>
);

export default Pricing;
