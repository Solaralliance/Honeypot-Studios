import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { track } from "@/lib/analytics";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const access = params.get("access") || "";
  const [state, setState] = useState("checking");
  const [onboardingPath, setOnboardingPath] = useState("");

  useEffect(() => {
    if (!sessionId) { setState("error"); return undefined; }
    let cancelled = false;
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      try {
        const response = await fetch(`${API}/payments/status/${encodeURIComponent(sessionId)}`);
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 404) { setState("error"); return; }
          throw new Error();
        }
        if (data.payment_status === "paid") {
          const accessResponse = await fetch(`${API}/payments/onboarding-access/${encodeURIComponent(sessionId)}?access=${encodeURIComponent(access)}`);
          const accessData = await accessResponse.json();
          if (!cancelled && accessResponse.ok) {
            setOnboardingPath(accessData.path);
            setState("paid");
            track("checkout_paid", { session: sessionId.slice(-8) });
          } else if (!cancelled) {
            setState("error");
          }
          return;
        }
        if (!cancelled && attempts < 6) setTimeout(check, 2000);
        else if (!cancelled) setState("pending");
      } catch {
        if (!cancelled && attempts < 4) setTimeout(check, 2000);
        else if (!cancelled) setState("error");
      }
    };
    check();
    return () => { cancelled = true; };
  }, [sessionId, access]);

  return (
    <>
      <SEO title="Payment confirmation" description="Confirming your HoneyPot Studio website package payment." path="/payment/success" noIndex />
      <Navbar />
      <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center px-6 py-32" data-testid="payment-success-page">
        <section className="w-full border border-white/10 bg-white/[0.02] p-8 sm:p-12">
          {state === "checking" && <div data-testid="payment-checking"><Loader2 className="h-9 w-9 animate-spin text-cyan-300" /><h1 className="mt-6 font-display text-3xl font-bold">Confirming your payment</h1><p className="mt-3 text-zinc-400">This normally takes a few seconds. Keep this page open.</p></div>}
          {state === "paid" && <div data-testid="payment-paid"><CheckCircle2 className="h-10 w-10 text-cyan-300" /><h1 className="mt-6 font-display text-3xl font-bold">Payment confirmed</h1><p className="mt-3 max-w-xl text-zinc-300">You run the business. We’ll handle the online presence. Your short onboarding questionnaire is ready, and we’ve also emailed the link.</p><Link to={onboardingPath} className="hp-neon-btn mt-8 inline-block" data-testid="payment-start-onboarding-button"><span className="flex items-center gap-2 rounded-full bg-[#050505] px-6 py-3 font-bold">Start onboarding <ArrowRight className="h-4 w-4" /></span></Link></div>}
          {state === "pending" && <div data-testid="payment-pending"><h1 className="font-display text-3xl font-bold">Payment is still processing</h1><p className="mt-3 text-zinc-400">Your payment has not been marked paid yet. You can safely revisit this link shortly.</p></div>}
          {state === "error" && <div data-testid="payment-error"><h1 className="font-display text-3xl font-bold">We could not confirm that payment</h1><p className="mt-3 text-zinc-400">No onboarding has started. Contact us and we’ll check the payment status.</p><a href="/#contact" className="mt-6 inline-flex text-cyan-300" data-testid="payment-error-contact-link">Contact HoneyPot Studio</a></div>}
        </section>
      </main>
      <Footer />
    </>
  );
}