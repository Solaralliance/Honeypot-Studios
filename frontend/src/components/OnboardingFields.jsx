import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Field = ({ id, label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className="border-white/15 bg-black/50" data-testid={`onboarding-${id}-input`} />
  </div>
);

const LongField = ({ id, label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={4} maxLength={2000} className="border-white/15 bg-black/50" data-testid={`onboarding-${id}-input`} />
  </div>
);

export const OnboardingFields = ({ step, form, set }) => {
  if (step === 0) return <div className="grid gap-5 sm:grid-cols-2"><Field id="contact-name" label="Your name" value={form.contact_name} onChange={set("contact_name")} placeholder="Who should we work with?" /><Field id="business-name" label="Business name" value={form.business_name} onChange={set("business_name")} placeholder="Your trading name" /><Field id="industry" label="Industry" value={form.industry} onChange={set("industry")} placeholder="Landscaping, construction…" /><Field id="current-website" label="Current website (optional)" value={form.current_website} onChange={set("current_website")} placeholder="https://" type="url" /></div>;
  if (step === 1) return <div className="space-y-5"><LongField id="services" label="What do you sell or do?" value={form.services} onChange={set("services")} placeholder="Describe your main services in your own words." /><LongField id="ideal-customer" label="Who is the right customer?" value={form.ideal_customer} onChange={set("ideal_customer")} placeholder="The jobs or customers you want more of." /><Field id="service-areas" label="Where do you work?" value={form.service_areas} onChange={set("service_areas")} placeholder="Suburbs, cities or Australia-wide" /></div>;
  if (step === 2) return <div className="space-y-5"><div className="space-y-2"><Label htmlFor="brand-voice">How should the business sound?</Label><select id="brand-voice" value={form.brand_voice} onChange={set("brand_voice")} className="h-10 w-full border border-white/15 bg-black/50 px-3 text-sm" data-testid="onboarding-brand-voice-select"><option value="">Choose one</option><option value="straightforward">Straightforward and practical</option><option value="premium">Premium and polished</option><option value="friendly">Friendly and local</option><option value="bold">Bold and energetic</option><option value="technical">Technical and authoritative</option></select></div><LongField id="brand-notes" label="Brand details (optional)" value={form.brand_notes} onChange={set("brand_notes")} placeholder="Colours, logo, tone, words you use—or dislike." /><LongField id="competitor-sites" label="Sites you like or compete with (optional)" value={form.competitor_sites} onChange={set("competitor_sites")} placeholder="Links are helpful. Tell us what you like about them." /></div>;
  return <div className="space-y-5"><LongField id="primary-goal" label="What should the website achieve first?" value={form.primary_goal} onChange={set("primary_goal")} placeholder="More quote requests, better-qualified leads, bookings…" /><LongField id="must-haves" label="Must-have features (optional)" value={form.must_haves} onChange={set("must_haves")} placeholder="Forms, booking, galleries, payments, CRM connections…" /><LongField id="online-presence" label="Your current online presence (optional)" value={form.online_presence} onChange={set("online_presence")} placeholder="Google Business Profile, socials, ads, directories…" /><LongField id="anything-else" label="Anything else we should know? (optional)" value={form.anything_else} onChange={set("anything_else")} placeholder="Constraints, timing, content or expectations." /></div>;
};