import { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import GradientText from "@/components/GradientText";
import ShimmerCard from "@/components/ShimmerCard";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FEATURES = {
  website_landing_aud: ["One focused page", "Mobile-first build", "Conversion-ready structure"],
  website_tradie_aud: ["Core service pages", "Quote enquiry flow", "Local SEO foundations"],
  website_custom_aud: ["Bespoke planning", "Custom workflows", "Integrations scoped with you"],
};

export default function BuyWebsite() {
  const [packages, setPackages] = useState([]);
  const [loadingKey, setLoadingKey] = useState("");

  useEffect(() => {
    fetch(`${API}/payments/packages`)
      .then((response) => response.json())
      .then((data) => setPackages(data.packages || []))
      .catch(() => setPackages([]));
  }, []);

  const checkout = async (lookupKey) => {
    setLoadingKey(lookupKey);
    track("checkout_start", { package: lookupKey });
    try {
      const response = await fetch(`${API}/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookup_key: lookupKey, origin_url: window.location.origin }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Checkout could not start");
      window.location.assign(data.checkout_url);
    } catch (error) {
      toast.error(error.message);
      setLoadingKey("");
    }
  };

  return (
    <section id="buy-website" className="scroll-mt-28 border-y border-white/5 bg-[#07090a] py-24" data-testid="buy-website-section">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal as="h2" testId="buy-website-heading" className="max-w-4xl font-display text-3xl font-bold sm:text-4xl">
          Ready to move? <GradientText>Choose your build.</GradientText>
        </Reveal>
        <Reveal delay={0.08} className="mt-5 max-w-3xl text-zinc-300">
          We recommend a quick conversation first so you buy the right scope—not the biggest one.
          If you already know what you need, you can pay securely and start onboarding now.
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-l-2 border-cyan-300 bg-cyan-300/[0.05] p-5" data-testid="buy-website-guidance">
          <MessageCircle className="h-6 w-6 text-cyan-300" aria-hidden="true" />
          <p className="flex-1 text-sm text-zinc-300">
            <strong className="text-white">You handle the business. We handle the online presence.</strong>{" "}
            Our questionnaire learns how you work without telling you how to run your company.
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-white" data-testid="buy-website-contact-first-link">
            Contact us first <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3" data-testid="buy-website-package-grid">
          {packages.map((item) => (
            <ShimmerCard key={item.lookup_key} className="flex h-full flex-col p-7" testId={`buy-package-${item.lookup_key}`}>
              <p className="text-xs font-semibold uppercase text-fuchsia-300">Website package</p>
              <h3 className="mt-4 font-display text-xl font-bold">{item.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.summary}</p>
              <p className="mt-6 text-3xl font-bold text-white">${item.price.toLocaleString("en-AU")}</p>
              <p className="mt-1 text-xs text-zinc-500">AUD · one-time payment</p>
              <ul className="mt-6 flex-1 space-y-3">
                {(FEATURES[item.lookup_key] || []).map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-zinc-300"><Check className="mt-0.5 h-4 w-4 text-cyan-300" />{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => checkout(item.lookup_key)}
                disabled={Boolean(loadingKey)}
                className="hp-neon-btn mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
                data-testid={`buy-package-button-${item.lookup_key}`}
              >
                <span className="flex items-center justify-center gap-2 rounded-full bg-[#050505] px-5 py-3 text-sm font-bold text-white">
                  {loadingKey === item.lookup_key ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening checkout…</> : <>Pay securely <ArrowRight className="h-4 w-4" /></>}
                </span>
              </button>
            </ShimmerCard>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-zinc-500" data-testid="buy-website-security-note">
          <ShieldCheck className="h-4 w-4 text-cyan-300" /> Secure Stripe Checkout. After payment, your onboarding link appears on screen and arrives by email.
        </p>
      </div>
    </section>
  );
}