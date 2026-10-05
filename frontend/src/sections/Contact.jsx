import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { track } from "@/lib/analytics";
import GradientText from "@/components/GradientText";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SERVICE_OPTIONS = [
  { value: "landing-page", label: "Landing Page — from $548" },
  { value: "tradie-website", label: "Tradie Website — from $1,048" },
  { value: "custom-website", label: "Custom Website — from $2,548" },
  { value: "crm-web-app", label: "CRM / Web App — from $1,999" },
  { value: "website-revamp", label: "Website Revamp — from $399" },
  { value: "digital-marketing", label: "Digital Marketing — from $448/mo" },
  { value: "social-media", label: "Social Media Management — from $498/mo" },
  { value: "website-hosting", label: "Website Hosting & Care — from $29/mo" },
  { value: "not-sure", label: "Not sure yet — help me figure it out" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", service: "not-sure", message: "", company: "" });
  const [sending, setSending] = useState(false);

  // "Who it's for" cards preselect the matching service in this form
  useEffect(() => {
    const handler = (e) => setForm((f) => ({ ...f, service: e.detail }));
    window.addEventListener("hp:prefill-service", handler);
    return () => window.removeEventListener("hp:prefill-service", handler);
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Something went wrong");
      }
      track("form_submit", { service: form.service });
      toast.success("Enquiry sent — we'll get back to you within one business day.");
      setForm({ name: "", email: "", service: "not-sure", message: "", company: "" });
    } catch (err) {
      track("form_error", { reason: String(err.message).slice(0, 80) });
      toast.error(err.message === "Failed to fetch" ? "Couldn't reach the server — please try again." : err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-28 overflow-hidden border-t border-white/5 bg-[#070707] py-24" data-testid="contact-section">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-fuchsia-600/15 blur-[130px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl px-6">
        <Reveal as="h2" testId="contact-heading" className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Tell us what you're <GradientText>building</GradientText>
        </Reveal>
        <Reveal delay={0.1} className="mt-4 text-center text-zinc-400">
          Four fields, one minute. No pushy sales calls — just a straight reply
          with honest pricing and a plan.
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={onSubmit} className="hp-shimmer-card mt-10 space-y-5 p-8" data-testid="contact-form" noValidate={false}>
            {/* honeypot — invisible to humans, bots fill it */}
            <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  data-testid="contact-name-input"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Your name"
                  value={form.name}
                  onChange={set("name")}
                  className="border-white/15 bg-black/50 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  data-testid="contact-email-input"
                  type="email"
                  required
                  placeholder="you@business.com.au"
                  value={form.email}
                  onChange={set("email")}
                  className="border-white/15 bg-black/50 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>What do you need?</Label>
              <Select value={form.service} onValueChange={(v) => setForm((f) => ({ ...f, service: v }))}>
                <SelectTrigger data-testid="contact-service-select" className="border-white/15 bg-black/50 text-white">
                  <SelectValue placeholder="Pick a service" />
                </SelectTrigger>
                <SelectContent className="border-white/15 bg-[#0a0a0a] text-white">
                  {SERVICE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} data-testid={`contact-service-option-${opt.value}`}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">Your project</Label>
              <Textarea
                id="contact-message"
                data-testid="contact-message-input"
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                placeholder="A sentence or two about your business and what you need the site to do."
                value={form.message}
                onChange={set("message")}
                className="border-white/15 bg-black/50 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              data-testid="contact-submit-button"
              className="hp-neon-btn w-full"
            >
              <span className="flex items-center justify-center gap-2 rounded-full bg-[#050505] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-white">
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Send Enquiry <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-xs text-zinc-600">
              We only use your details to reply to this enquiry. See our{" "}
              <a href="/privacy-security" className="text-zinc-400 underline underline-offset-2 hover:text-cyan-300">
                Security &amp; Privacy
              </a>{" "}
              page for exactly what we track and why.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
