import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { Progress } from "@/components/ui/progress";
import { OnboardingFields } from "@/components/OnboardingFields";
import { track } from "@/lib/analytics";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TITLES = ["Your business", "Your customers", "Your brand", "Your website goals"];
const REQUIRED = [["contact_name", "business_name", "industry"], ["services", "ideal_customer", "service_areas"], ["brand_voice"], ["primary_goal"]];
const INITIAL = { contact_name: "", business_name: "", industry: "", current_website: "", services: "", ideal_customer: "", service_areas: "", brand_voice: "", brand_notes: "", competitor_sites: "", primary_goal: "", must_haves: "", online_presence: "", anything_else: "" };

export default function Onboarding() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState("loading");
  const [packageName, setPackageName] = useState("");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);

  useEffect(() => {
    fetch(`${API}/onboarding/${encodeURIComponent(token)}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => { setPackageName(data.package_name); setState(data.completed ? "complete" : "ready"); })
      .catch(() => setState("error"));
  }, [token]);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const next = () => {
    const missing = REQUIRED[step].some((key) => !form[key].trim());
    if (missing) { toast.error("Please complete the required questions on this step."); return; }
    setStep((current) => Math.min(3, current + 1));
  };
  const submit = async () => {
    if (!form.primary_goal.trim()) { toast.error("Please add the website's main goal."); return; }
    setState("submitting");
    try {
      const response = await fetch(`${API}/onboarding/${encodeURIComponent(token)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Questionnaire could not be saved");
      track("onboarding_submit", { package: packageName });
      setState("complete");
    } catch (error) {
      toast.error(error.message);
      setState("ready");
    }
  };

  return <><SEO title="Website onboarding" description="Tell HoneyPot Studio about your business and website goals." path="/onboarding" noIndex /><Navbar /><main className="mx-auto min-h-[80vh] max-w-4xl px-6 pb-24 pt-32" data-testid="onboarding-page">
    {state === "loading" && <div data-testid="onboarding-loading"><Loader2 className="h-8 w-8 animate-spin text-cyan-300" /></div>}
    {state === "error" && <section data-testid="onboarding-error"><h1 className="font-display text-3xl font-bold">This onboarding link is not available</h1><p className="mt-3 text-zinc-400">Use the link shown after a confirmed payment or contact us for help.</p><a href="/#contact" className="mt-6 inline-block text-cyan-300" data-testid="onboarding-error-contact-link">Contact HoneyPot Studio</a></section>}
    {state === "complete" && <section className="border border-cyan-300/20 bg-cyan-300/[0.04] p-8 sm:p-12" data-testid="onboarding-complete"><CheckCircle2 className="h-10 w-10 text-cyan-300" /><h1 className="mt-6 font-display text-3xl font-bold">Onboarding complete</h1><p className="mt-3 max-w-xl text-zinc-300">That gives us a strong starting point. We’ll review your answers and get in touch about the next step.</p></section>}
    {(state === "ready" || state === "submitting") && <section data-testid="onboarding-form-section"><p className="text-xs font-semibold uppercase text-cyan-300">{packageName}</p><h1 className="mt-4 font-display text-3xl font-black sm:text-5xl">Tell us how your business works</h1><p className="mt-4 max-w-2xl text-zinc-400">No jargon and no telling you how to run the business. You give us the context; we shape the online presence around it.</p><div className="mt-8"><div className="mb-3 flex justify-between text-xs text-zinc-500"><span>Step {step + 1} of 4</span><span>{TITLES[step]}</span></div><Progress value={(step + 1) * 25} className="bg-white/10" data-testid="onboarding-progress" /></div><form onSubmit={(event) => event.preventDefault()} className="mt-8 border border-white/10 bg-white/[0.02] p-6 sm:p-8" data-testid="onboarding-form"><h2 className="mb-6 font-display text-xl font-bold">{TITLES[step]}</h2><OnboardingFields step={step} form={form} set={set} /><div className="mt-8 flex items-center justify-between gap-4"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || state === "submitting"} className="inline-flex items-center gap-2 text-sm text-zinc-400 disabled:opacity-30" data-testid="onboarding-back-button"><ArrowLeft className="h-4 w-4" /> Back</button>{step < 3 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 bg-cyan-300 px-5 py-3 text-sm font-bold text-black" data-testid="onboarding-next-button">Next <ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={submit} disabled={state === "submitting"} className="inline-flex items-center gap-2 bg-cyan-300 px-5 py-3 text-sm font-bold text-black disabled:opacity-60" data-testid="onboarding-submit-button">{state === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <>Send onboarding <ArrowRight className="h-4 w-4" /></>}</button>}</div></form></section>}
  </main><Footer /></>;
}