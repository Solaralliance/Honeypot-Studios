import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Target, HardHat, Code2, Database, TrendingUp, Share2, Server } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NeonButton from "@/components/NeonButton";
import GradientText from "@/components/GradientText";

const LOGO_URL = "https://customer-assets-eiarnc6j.emergentagent.net/job_8a876f68-14ba-49e3-84f0-dfe2beb700a7/artifacts/dm7w1hq2_22101766-41AF-479A-B542-D065C2D735C6.webp";

export const SERVICE_MENU = [
  { icon: Target, label: "Landing Pages", price: "from $548", href: "/#services" },
  { icon: HardHat, label: "Tradie Websites", price: "from $1,048", href: "/#services" },
  { icon: Code2, label: "Custom Websites", price: "from $2,548", href: "/#services" },
  { icon: Database, label: "CRMs & Web Apps", price: "from $1,999", href: "/#build-types" },
  { icon: TrendingUp, label: "Digital Marketing", price: "from $448/mo", href: "/#services" },
  { icon: Share2, label: "Social Media Management", price: "from $498/mo", href: "/#services" },
  { icon: Server, label: "Website Hosting", price: "from $29/mo", href: "/#pricing" },
];

const NAV_LINKS = [
  { label: "What We Build", href: "/#build-types" },
  { label: "Work", href: "/#work" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hp-glass" data-testid="navbar">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-logo-link" aria-label="HoneyPot Studio home">
          <img
            src={LOGO_URL}
            alt="HoneyPot Studio logo — hexagonal honeycomb mark dissolving into particles"
            className="h-9 w-auto rounded-md"
            width={36}
            height={36}
            loading="eager"
            decoding="async"
          />
          <span className="font-display text-lg font-bold tracking-tight">
            Honey<GradientText>Pot</GradientText>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 outline-none transition-colors hover:text-white data-[state=open]:text-white"
              data-testid="nav-services-dropdown-trigger"
            >
              Services <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-80 border-white/10 bg-[#0a0a0a]/95 p-2 backdrop-blur-xl"
              data-testid="nav-services-dropdown"
            >
              {SERVICE_MENU.map((item) => (
                <DropdownMenuItem key={item.label} asChild className="p-0">
                  <a
                    href={item.href}
                    data-testid={`nav-service-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 transition-colors group-hover:border-cyan-400/50 group-hover:text-cyan-300">
                      <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-white">{item.label}</span>
                      <span className="block text-xs text-zinc-500">{item.price}</span>
                    </span>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <NeonButton href="/#contact" testId="nav-cta-button" trackLabel="nav-start-project">
            Start a Project
          </NeonButton>
        </div>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-white/10 px-6 py-4 lg:hidden" data-testid="nav-mobile-menu">
          <p className="pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Services</p>
          <div className="flex flex-col gap-1">
            {SERVICE_MENU.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5"
              >
                <item.icon className="h-4 w-4 text-fuchsia-400" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                <span className="text-xs text-zinc-500">{item.price}</span>
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-zinc-300"
              >
                {link.label}
              </a>
            ))}
            <NeonButton href="/#contact" testId="nav-mobile-cta-button" trackLabel="nav-mobile-start-project">
              Start a Project
            </NeonButton>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
