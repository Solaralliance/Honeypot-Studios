import { ShieldCheck, Eye, Cookie, Server, Lock, FileCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";
import GradientText from "@/components/GradientText";

const SECTIONS = [
  {
    icon: Eye,
    title: "What we track, and exactly why",
    body: [
      "We believe in being upfront: this site uses analytics and marketing tools. Here's the full list — nothing hidden.",
      "Google Analytics 4 (GA4), when enabled with consent: measures page views, session duration and which pages lead to enquiries, so we know what's working.",
      "Meta Pixel, when enabled with consent: measures whether visitors from Facebook or Instagram go on to make an enquiry, so ad spend isn't wasted.",
      "Google Search Console & Bing Webmaster Tools: show how the site appears in search results and flag indexing or security issues. These read search data — they don't track you on the page.",
      "Resend: delivers our transactional email (contact form notifications and confirmations). It processes the email address you give us solely to deliver that email.",
      "Stripe: processes website package checkout, billing details and payment status. Card details are entered on Stripe Checkout and are not stored by this website.",
      "First-party interaction analytics: after you consent, our own lightweight counter records page views, CTA clicks, carousel interactions and form outcomes — no names, no emails, no cross-site tracking. It exists so we can see which sections of this page actually convert.",
      "The OAIC does not ban pixels, but covert collection is likely to be unfair under APP 3. Our collection notice states what we collect and why. Confirm privacy wording with your solicitor before relying on it as legal advice.",
      "Returning-visitor offer: this browser stores a simple previous-visit marker so it can show the optional 20% offer panel on a later visit. It is not a fingerprint and is never used to record keystrokes.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies",
    body: [
      "GA4 and the Meta Pixel can set cookies to distinguish visits. They are not loaded without consent. We don't set advertising cookies of our own, and we don't sell or share your data with data brokers. The site and contact form work without analytics consent.",
    ],
  },
  {
    icon: FileCheck,
    title: "What we collect from the contact form",
    body: [
      "If you send us an enquiry we store your name, email, chosen service and message so we can reply. That's it. We never ask for passwords, card details or ID through this site or by email — if you ever get a message asking for those claiming to be us, it isn't us.",
      "A previous enquirer can explicitly request one 20% offer email. The email contains no tracking pixel and includes an unsubscribe link. We do not send recurring promotional blasts through this form.",
      "Enquiries are kept only as long as needed to handle your project and meet legal obligations, then deleted on request.",
    ],
  },
  {
    icon: Lock,
    title: "How we keep the site safe",
    body: [
      "HTTPS everywhere via Cloudflare, with DNS managed on our own Cloudflare account.",
      "OWASP-aligned headers: content-type sniffing blocked, clickjacking prevented (frame deny), strict referrer policy and a locked-down permissions policy.",
      "The contact form is rate-limited, honeypot-protected and server-validated. Email content is escaped and templated server-side — nothing you type can inject into emails.",
      "API surface is minimal: no public docs, no open database routes, dependencies pinned and scanned.",
    ],
  },
  {
    icon: Server,
    title: "Our infrastructure discipline",
    body: [
      "Code lives in a private GitHub repository. Secrets and API keys live only in environment variables — never in the repo — and every deploy is gated by an automated secret scan and lint checks.",
      "Hosting runs on Vercel with Cloudflare in front for DNS and DDoS protection. The same infrastructure discipline we sell is the discipline we run on.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Your rights",
    body: [
      "Under the Australian Privacy Act you can ask what we hold about you, ask us to correct it, or ask us to delete it. Email honeypotweb@proton.me or send a note through the contact form marked 'Privacy request' and we'll action it promptly.",
      "This page was last reviewed in January 2026. If we change what we track, we change this page first.",
    ],
  },
];

const PrivacySecurity = () => (
  <>
    <SEO
      title="Security & Privacy"
      description="Exactly what HoneyPot Studio tracks (GA4, Meta Pixel, Search Console, Bing Webmaster Tools, Resend), what we collect from the contact form, and the security measures behind this site."
      path="/privacy-security"
    />
    <Navbar />
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32" data-testid="privacy-page">
      <Reveal as="h1" testId="privacy-heading" className="font-display text-4xl font-black tracking-tighter sm:text-5xl">
        Security &amp; <GradientText>Privacy</GradientText>
      </Reveal>
      <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
        The honest version, not the legal wallpaper version. What we track,
        why we track it, and how this site is defended.
      </Reveal>

      <div className="mt-14 space-y-10">
        {SECTIONS.map((section) => (
          <Reveal key={section.title} testId={`privacy-section-${section.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
            <section className="hp-shimmer-card p-8">
              <div className="flex items-center gap-3">
                <section.icon className="h-6 w-6 text-cyan-400" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold">{section.title}</h2>
              </div>
              <div className="mt-4 space-y-3">
                {section.body.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-zinc-400">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </main>
    <Footer />
  </>
);

export default PrivacySecurity;
