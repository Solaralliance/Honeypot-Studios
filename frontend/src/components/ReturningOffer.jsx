import { useEffect, useState } from "react";
import { ArrowRight, Gift, X } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ReturningOffer = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const previousVisit = localStorage.getItem("hp-previous-visit");
    localStorage.setItem("hp-previous-visit", new Date().toISOString());
    if (previousVisit && !localStorage.getItem("hp-offer-dismissed")) {
      const timer = setTimeout(() => setVisible(true), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const dismiss = () => {
    localStorage.setItem("hp-offer-dismissed", "true");
    setVisible(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch(`${API}/offers/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Offer request failed");
      toast.success("If this matches a previous enquiry, your one-time offer is on its way.");
      localStorage.setItem("hp-offer-dismissed", "true");
      setVisible(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  if (!visible) return null;
  return (
    <aside className="fixed bottom-4 left-4 right-4 z-[65] border border-fuchsia-400/30 bg-[#090909]/95 p-5 shadow-[0_0_45px_rgba(255,0,255,0.16)] backdrop-blur-xl sm:left-auto sm:right-6 sm:w-[28rem]" data-testid="returning-offer-panel">
      <button type="button" onClick={dismiss} className="absolute right-3 top-3 text-zinc-500 hover:text-white" aria-label="Dismiss offer" data-testid="returning-offer-dismiss-button"><X className="h-5 w-5" /></button>
      <div className="flex items-start gap-4">
        <Gift className="mt-1 h-7 w-7 shrink-0 text-fuchsia-300" aria-hidden="true" />
        <div className="flex-1 pr-7">
          <p className="text-xs font-bold uppercase text-cyan-300">Welcome back</p>
          <h2 className="mt-2 font-display text-lg font-bold">Claim 20% off your website build</h2>
          <p className="mt-2 text-sm text-zinc-400">Previous enquirers can request one professional offer email. No tracking pixel and no recurring spam.</p>
          <form onSubmit={submit} className="mt-4 flex flex-col gap-3" data-testid="returning-offer-form">
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your previous enquiry email" className="min-w-0 flex-1 border border-white/15 bg-black/60 px-4 py-3 text-sm text-white" data-testid="returning-offer-email-input" />
            <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-2 bg-cyan-300 px-5 py-3 text-sm font-bold text-black disabled:opacity-60" data-testid="returning-offer-submit-button">{sending ? "Sending…" : <>Send my offer <ArrowRight className="h-4 w-4" /></>}</button>
          </form>
        </div>
      </div>
    </aside>
  );
};