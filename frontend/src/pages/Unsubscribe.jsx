import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const [state, setState] = useState("ready");
  const token = params.get("token") || "";
  const unsubscribe = async () => {
    setState("saving");
    try {
      await fetch(`${API}/offers/unsubscribe/${encodeURIComponent(token)}`, { method: "POST" });
      setState("done");
    } catch {
      setState("error");
    }
  };
  return <><SEO title="Unsubscribe" description="Unsubscribe from HoneyPot Studio website offers." path="/unsubscribe" noIndex /><Navbar /><main className="mx-auto flex min-h-[75vh] max-w-3xl items-center px-6 py-32" data-testid="unsubscribe-page"><section className="w-full border border-white/10 bg-white/[0.02] p-8 sm:p-12">{state === "done" ? <div data-testid="unsubscribe-complete"><CheckCircle2 className="h-9 w-9 text-cyan-300" /><h1 className="mt-5 font-display text-3xl font-bold">You’re unsubscribed</h1><p className="mt-3 text-zinc-400">We will not send future website offers to this address.</p></div> : <div data-testid="unsubscribe-confirm"><h1 className="font-display text-3xl font-bold">Stop future offer emails?</h1><p className="mt-3 text-zinc-400">This does not affect project, payment or onboarding emails you need to receive.</p><button type="button" onClick={unsubscribe} disabled={!token || state === "saving"} className="mt-7 bg-cyan-300 px-5 py-3 font-bold text-black disabled:opacity-40" data-testid="unsubscribe-confirm-button">{state === "saving" ? "Updating…" : "Unsubscribe"}</button>{state === "error" && <p className="mt-4 text-red-300" data-testid="unsubscribe-error">We could not update that preference. Please contact us.</p>}</div>}</section></main><Footer /></>;
}