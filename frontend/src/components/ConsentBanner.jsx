import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { setAnalyticsConsent } from "@/lib/analytics";

export const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem("hp-analytics-consent") === null);
  }, []);

  const choose = (value) => {
    setAnalyticsConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-3xl border border-cyan-400/30 bg-[#080a0b]/95 p-5 shadow-[0_0_40px_rgba(0,255,255,0.12)] backdrop-blur-xl sm:flex sm:items-center sm:gap-6"
      data-testid="analytics-consent-banner"
      aria-label="Analytics consent"
    >
      <ShieldCheck className="hidden h-8 w-8 shrink-0 text-cyan-300 sm:block" aria-hidden="true" />
      <p className="flex-1 text-sm leading-relaxed text-zinc-300" data-testid="analytics-consent-message">
        We use privacy-conscious first-party events to learn which pages help. No fingerprinting,
        keystroke recording or advertising cookies. Choose whether to share anonymous usage events.
      </p>
      <div className="mt-4 flex shrink-0 gap-3 sm:mt-0">
        <button
          type="button"
          onClick={() => choose("rejected")}
          className="border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
          data-testid="analytics-consent-reject-button"
        >
          No thanks
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="bg-cyan-300 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white"
          data-testid="analytics-consent-accept-button"
        >
          Allow analytics
        </button>
      </div>
    </aside>
  );
};