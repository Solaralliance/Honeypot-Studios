import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

const TERMS = [
  ["Scope before build", "Package checkout reserves the selected website build. We still confirm scope, timing and required materials before work begins. Features outside the published package may need a separate quote."],
  ["Payments and cancellations", "Payments are processed by Stripe in AUD. Contact us promptly if you paid for the wrong package. Refunds and cancellations are assessed against work already completed and any non-recoverable costs."],
  ["Your business, your decisions", "You remain responsible for business, legal, tax and operational decisions. We handle the agreed online presence and technical delivery; we do not direct how you run the business."],
  ["Content and access", "You confirm that supplied logos, photos, copy and account access can legally be used for the project. Delays in content, approvals or access can change the delivery date."],
  ["Results", "We build for usability, search visibility and conversion, but do not guarantee rankings, revenue, lead volume or third-party platform availability."],
  ["Ownership", "Once the agreed project balance is paid, you own the approved website deliverables unless a proposal identifies licensed third-party assets or services."],
  ["Privacy and platforms", "Our Privacy & Security page explains use of Stripe, Resend, Vercel, Cloudflare, GA4, Meta Pixel, Search Console and Bing Webmaster Tools. Third-party services also apply their own terms."],
];

export default function Terms() {
  return <><SEO title="Terms & Conditions" description="Terms for HoneyPot Studio website packages, payments, scope, ownership and third-party services." path="/terms" /><Navbar /><main className="mx-auto max-w-4xl px-6 pb-24 pt-32" data-testid="terms-page"><h1 className="font-display text-4xl font-black sm:text-5xl" data-testid="terms-heading">Terms &amp; Conditions</h1><p className="mt-5 max-w-2xl text-zinc-400">Plain-English project terms. Have your solicitor review them for your exact business and jurisdiction before relying on them as legal advice.</p><div className="mt-12 divide-y divide-white/10 border-y border-white/10">{TERMS.map(([title, body]) => <section key={title} className="py-7" data-testid={`terms-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`}><h2 className="font-display text-lg font-bold">{title}</h2><p className="mt-3 leading-relaxed text-zinc-400">{body}</p></section>)}</div></main><Footer /></>;
}