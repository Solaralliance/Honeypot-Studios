import { Target, HardHat, Code2, TrendingUp, Share2, Server, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ShimmerCard from "@/components/ShimmerCard";
import { track } from "@/lib/analytics";
import GradientText from "@/components/GradientText";

const SERVICES = [
  {
    icon: Target,
    name: "Landing Pages",
    price: "from $548",
    span: "md:col-span-4",
    description:
      "One page, one job: turn clicks into customers. Sharp copy structure, fast load, clear call-to-action.",
    points: ["Conversion-focused layout", "Mobile-first build", "Launch in days, not months"],
  },
  {
    icon: HardHat,
    name: "Tradie Websites",
    price: "from $1,048",
    span: "md:col-span-4",
    description:
      "Professional sites for local trade businesses. Quote forms, service areas, reviews — built to make the phone ring.",
    points: ["Quote & booking forms", "Local SEO setup", "Google Business Profile ready"],
  },
  {
    icon: Code2,
    name: "Custom-Made Websites",
    price: "from $2,548",
    span: "md:col-span-4",
    description:
      "Designed around your brand and goals. E-commerce, bookings, CRMs, portals — if you can describe it, we can build it.",
    points: ["Fully bespoke design", "E-commerce, CRM & integrations", "You own everything"],
  },
  {
    icon: TrendingUp,
    name: "Digital Marketing",
    price: "from $448/mo",
    span: "md:col-span-4",
    description:
      "SEO, Google Ads and analytics with reporting you can actually read. We tell you what's working and cut what isn't.",
    points: ["SEO foundations & local search", "Google Ads management", "GA4 conversion tracking"],
  },
  {
    icon: Share2,
    name: "Social Media Management",
    price: "from $498/mo",
    span: "md:col-span-4",
    description:
      "A realistic content calendar, creative, scheduling and replies — run for you. Consistency without it eating your week.",
    points: ["Content calendar & creative", "Scheduling & comment replies", "Monthly plain-English report"],
  },
  {
    icon: Server,
    name: "Website Hosting & Care",
    price: "from $29/mo",
    span: "md:col-span-4",
    description:
      "Hosting on accounts you own (Vercel + Cloudflare), with uptime monitoring, updates and small content tweaks handled.",
    points: ["Your accounts, your assets", "Uptime & security updates", "Small tweaks included"],
  },
];

const Services = () => (
  <section id="services" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24" data-testid="services-section">
    <Reveal as="h2" testId="services-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
      Services, <GradientText>priced straight</GradientText>
    </Reveal>
    <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
      All prices in AUD. No lock-in contracts, no surprise invoices, no fake
      urgency. If a service won't pay for itself in your business, we'll tell
      you not to buy it.
    </Reveal>

    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
      {SERVICES.map((service) => (
        <ShimmerCard
          key={service.name}
          testId={`service-card-${service.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          className={`${service.span} p-8`}
        >
          <div className="flex items-start justify-between gap-4">
            <service.icon className="h-9 w-9 text-fuchsia-400" aria-hidden="true" />
            <span className="rounded-full border border-cyan-400/40 px-4 py-1 text-sm font-semibold text-cyan-300">
              {service.price}
            </span>
          </div>
          <h3 className="mt-5 font-display text-xl font-bold">{service.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{service.description}</p>
          <ul className="mt-5 space-y-2">
            {service.points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-zinc-300">
                <ArrowRight className="h-3.5 w-3.5 text-fuchsia-400" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => track("cta_click", { label: `service-${service.name}` })}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-400 transition-colors hover:text-cyan-300"
            data-testid={`service-cta-${service.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          >
            Get a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </ShimmerCard>
      ))}
    </div>

    <Reveal delay={0.1} className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-400" testId="services-honesty-note">
      <strong className="text-white">Straight up:</strong> every build includes
      hosting setup on your own accounts (Vercel, Cloudflare, GitHub — yours,
      not ours), SEO fundamentals, security headers and analytics wiring. What
      we skip: bloated page builders, rented websites you never own, and
      "maintenance fees" for changes you could make yourself.
    </Reveal>
  </section>
);

export default Services;
