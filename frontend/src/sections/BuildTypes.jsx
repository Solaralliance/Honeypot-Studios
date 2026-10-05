import {
  Target, HardHat, ShoppingCart, Database, CalendarCheck,
  LayoutDashboard, Rocket, Building2, Newspaper, UtensilsCrossed,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import GradientText from "@/components/GradientText";

const TYPES = [
  { icon: Target, name: "Landing Pages", desc: "One page, one goal — ads-ready and built to convert clicks into calls." },
  { icon: HardHat, name: "Tradie & Local Business Sites", desc: "Quote forms, service areas, reviews and local SEO baked in." },
  { icon: ShoppingCart, name: "E-commerce Stores", desc: "Stripe-ready checkouts, product catalogues and trade-in flows." },
  { icon: Database, name: "CRMs & Client Portals", desc: "Custom pipelines, job tracking and customer data — no per-seat fees." },
  { icon: CalendarCheck, name: "Booking & Appointment Systems", desc: "Live availability, reminders and deposits taken upfront." },
  { icon: LayoutDashboard, name: "Dashboards & Web Apps", desc: "Internal tools, reporting views and admin panels that people actually use." },
  { icon: Rocket, name: "SaaS MVPs", desc: "Your idea, validated fast — auth, billing and the core loop first." },
  { icon: Building2, name: "Real Estate & Listing Portals", desc: "Property showcases, appraisal funnels and enquiry routing." },
  { icon: Newspaper, name: "Blogs & Content Sites", desc: "SEO-structured publishing that compounds organic traffic." },
  { icon: UtensilsCrossed, name: "Hospitality & Venue Sites", desc: "Menus, bookings, events and Google Maps integration." },
];

const BuildTypes = () => (
  <section id="build-types" className="scroll-mt-28 border-y border-white/5 bg-[#070707] py-24" data-testid="build-types-section">
    <div className="mx-auto max-w-7xl px-6">
      <Reveal as="h2" testId="build-types-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Websites, apps, CRMs — <GradientText>if it's on the web, we build it</GradientText>
      </Reveal>
      <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
        Custom builds aren't just "a nicer website". Here's the honest range of
        what comes out of this studio.
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TYPES.map((type, i) => (
          <Reveal
            key={type.name}
            delay={(i % 5) * 0.06}
            testId={`build-type-${type.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            className="group rounded-xl border border-white/10 bg-black/40 p-5 transition-all hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5"
          >
            <type.icon className="h-7 w-7 text-fuchsia-400 transition-colors group-hover:text-cyan-300" aria-hidden="true" />
            <h3 className="mt-4 text-sm font-bold text-white">{type.name}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{type.desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default BuildTypes;
