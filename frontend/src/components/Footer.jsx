import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import GradientText from "@/components/GradientText";

const LOGO_URL = "https://customer-assets-eiarnc6j.emergentagent.net/job_8a876f68-14ba-49e3-84f0-dfe2beb700a7/artifacts/dm7w1hq2_22101766-41AF-479A-B542-D065C2D735C6.webp";

const SITEMAP = [
  {
    title: "Site",
    links: [
      { label: "Home", href: "/#" },
      { label: "Who It's For", href: "/#who" },
      { label: "Our Work", href: "/#work" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Services & Packages", href: "/#services" },
      { label: "What We Build (Sites, Apps, CRMs)", href: "/#build-types" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Extras & Add-ons", href: "/#extras" },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#070707]" data-testid="footer">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="HoneyPot Studio logo in footer"
            className="h-8 w-auto rounded"
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
          />
          <span className="font-display text-base font-bold">
            Honey<GradientText>Pot</GradientText>
          </span>
        </div>
        <p className="mt-4 max-w-xs text-sm text-zinc-400">
          Our website design studio. 200+ websites, apps and CRMs built for
          tradies, small businesses and marketing pros — Australia-wide, fully
          remote.
        </p>
      </div>

      {SITEMAP.map((col) => (
        <nav key={col.title} aria-label={`Footer — ${col.title}`}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{col.title}</h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            {col.links.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("/blog") ? (
                  <Link to={link.href} className="transition-colors hover:text-white" data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className="transition-colors hover:text-white" data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ))}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Trust</h3>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li>
            <Link to="/privacy-security" className="flex items-center gap-2 transition-colors hover:text-white" data-testid="footer-link-privacy">
              <ShieldCheck className="h-4 w-4 text-cyan-400" /> Security &amp; Privacy
            </Link>
          </li>
          <li className="text-zinc-500">No lock-in contracts. You own your site.</li>
          <li className="text-zinc-500">Secrets stay in env files — never in git.</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/5 py-6 text-center text-xs text-zinc-600">
      © {new Date().getFullYear()} HoneyPot Studio — our website design studio. Built in Australia.
    </div>
  </footer>
);

export default Footer;
