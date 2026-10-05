import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import PrivacySecurity from "@/pages/PrivacySecurity";
import { track } from "@/lib/analytics";

const PageTracker = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    track("page_view", { path: location.pathname });
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
            <Route path="/privacy-security" element={<PrivacySecurity />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Toaster theme="dark" position="bottom-right" />
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
