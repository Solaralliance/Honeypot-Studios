import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Compass } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import SEO from "@/components/SEO";
import ShimmerCard from "@/components/ShimmerCard";
import GradientText from "@/components/GradientText";
import { track } from "@/lib/analytics";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LearnHub() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/learn`)
      .then((response) => response.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Myscapez Learn Hub"
        description="Practical Australian guides to SEO, GEO, AEO, Vercel, Cloudflare, Resend email automation, privacy analytics and OWASP form security."
        path="/learn"
      />
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32" data-testid="learn-hub-page">
        <Reveal as="h1" testId="learn-hub-heading" className="max-w-5xl font-display text-4xl font-black sm:text-5xl lg:text-6xl">
          The Myscapez <GradientText>Learn Hub</GradientText>
        </Reveal>
        <Reveal delay={0.08} className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-300">
          Practical web education for Australian trade and small-business sites. The risk, the fix,
          and the reason—without attack strings, fake rankings or jargon.
        </Reveal>
        <Reveal delay={0.12} className="mt-6 flex items-start gap-3 border-l-2 border-fuchsia-400 bg-fuchsia-400/[0.05] p-5 text-sm text-zinc-300" testId="learn-hub-disclaimer">
          <Compass className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-300" aria-hidden="true" />
          <p>Confirm privacy wording with your solicitor. This is education, not personalised legal or tax advice.</p>
        </Reveal>

        {loading ? (
          <p className="mt-16 text-zinc-500" data-testid="learn-hub-loading">Loading guides…</p>
        ) : (
          <section className="mt-14 grid gap-6 md:grid-cols-2" aria-label="Learn articles" data-testid="learn-hub-grid">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/learn/${post.slug}`}
                onClick={() => track("blog_open", { slug: post.slug, source: "learn_hub" })}
                data-testid={`learn-card-${post.slug}`}
                className="group"
              >
                <ShimmerCard className="h-full overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image.url}
                      alt={post.image.alt}
                      width={post.image.width}
                      height={post.image.height}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4 text-xs uppercase text-cyan-300">
                      <span>{post.category}</span>
                      <span className="flex items-center gap-1.5 text-zinc-500"><Clock className="h-3.5 w-3.5" /> {post.read_time} min</span>
                    </div>
                    <h2 className="mt-4 font-display text-lg font-bold leading-snug text-white">{post.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-300">Read guide <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </ShimmerCard>
              </Link>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}