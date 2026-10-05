import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import CaseStudy from "@/pages/CaseStudy";
import PrivacySecurity from "@/pages/PrivacySecurity";
import LearnHub from "@/pages/LearnHub";
import LearnArticle from "@/pages/LearnArticle";
import { ConsentBanner } from "@/components/ConsentBanner";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";
import Onboarding from "@/pages/Onboarding";
import Terms from "@/pages/Terms";
import Unsubscribe from "@/pages/Unsubscribe";
import { track } from "@/lib/analytics";

const PageTracker = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const event = location.pathname.startsWith("/learn/") ? "learn_page_view" : "page_view";
    track(event, { path: location.pathname });
    const consentHandler = (consentEvent) => {
      if (consentEvent.detail === "accepted") track(event, { path: location.pathname });
    };
    window.addEventListener("hp:analytics-consent", consentHandler);
    return () => window.removeEventListener("hp:analytics-consent", consentHandler);
  }, [location.pathname]);
  return null;
};

function App() {
  return (
    <div className="App hp-noise">
      <HelmetProvider>
        <BrowserRouter>
          <PageTracker />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/:slug" element={<LearnArticle />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/privacy-security" element={<PrivacySecurity />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Toaster theme="dark" position="bottom-right" />
          <ConsentBanner />
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
